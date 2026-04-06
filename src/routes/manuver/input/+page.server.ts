import { db } from '$lib/server/db';
import { manuver, penyulang, garduInduk } from '$lib/server/db/schema';
import { desc, eq, aliasedTable } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		const listPenyulang = await db
			.select({
				id: penyulang.id,
				nama: penyulang.nama,
				ulp: penyulang.ulp,
				trf: penyulang.trf,
				garduIndukId: penyulang.garduIndukId,
				garduIndukNama: garduInduk.nama
			})
			.from(penyulang)
			.leftJoin(garduInduk, eq(penyulang.garduIndukId, garduInduk.id))
			.orderBy(penyulang.ulp, penyulang.nama);

		const pAsal = aliasedTable(penyulang, 'pAsal');
		const pTujuan = aliasedTable(penyulang, 'pTujuan');

		const listManuver = await db
			.select({
				id: manuver.id,
				section: manuver.section,
				waktuManuver: manuver.waktuManuver,
				waktuPenormalan: manuver.waktuPenormalan,
				bebanSebelum: manuver.bebanSebelum,
				bebanAmpereManuver: manuver.bebanAmpereManuver,
				pelaksanaan: manuver.pelaksanaan,
				keterangan: manuver.keterangan,
				status: manuver.status,
				penyulangAsalNama: pAsal.nama,
				penyulangAsalUlp: pAsal.ulp,
				penyulangTujuanNama: pTujuan.nama,
				penyulangTujuanUlp: pTujuan.ulp
			})
			.from(manuver)
			.leftJoin(pAsal, eq(manuver.penyulangAsalId, pAsal.id))
			.leftJoin(pTujuan, eq(manuver.penyulangTujuanId, pTujuan.id))
			.orderBy(desc(manuver.waktuManuver))
			.limit(50); // Get recent 50 entries 

		return { listPenyulang, listManuver: listManuver as any };
	} catch (error) {
		console.error('INPUT LOAD ERROR:', error);
		return { listPenyulang: [], listManuver: [] };
	}
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const penyulangAsalId = Number(formData.get('penyulangAsalId'));
		const penyulangTujuanId = Number(formData.get('penyulangTujuanId'));
		const section = formData.get('section')?.toString() || null;
		const bebanSebelum = Number(formData.get('bebanSebelum'));
		const bebanAmpereManuver = Number(formData.get('bebanAmpereManuver'));
		const waktuManuverStr = formData.get('waktuManuver')?.toString();
		const waktuPenormalanStr = formData.get('waktuPenormalan')?.toString();
		const pelaksanaan = formData.get('pelaksanaan')?.toString() || null;
		const keterangan = formData.get('keterangan')?.toString() || null;

		// Validation
		if (!penyulangAsalId || !penyulangTujuanId) {
			return fail(400, { message: 'Penyulang Existing dan Manuver Ke wajib dipilih.' });
		}
		if (!waktuManuverStr) {
			return fail(400, { message: 'Waktu Manuver wajib diisi.' });
		}
		if (isNaN(bebanAmpereManuver) || bebanAmpereManuver <= 0) {
			return fail(400, { message: 'Beban Manuver harus angka > 0.' });
		}

		try {
			const waktuManuver = new Date(waktuManuverStr);
			const waktuPenormalan = waktuPenormalanStr ? new Date(waktuPenormalanStr) : null;

			await db.insert(manuver).values({
				penyulangAsalId,
				penyulangTujuanId,
				section,
				waktuManuver,
				waktuPenormalan,
				bebanAmpereManuver,
				bebanSebelum: bebanSebelum || 0,
				pelaksanaan,
				keterangan,
				status: waktuPenormalan ? 'NORMAL' : 'AKTIF'
			});
		} catch (e) {
			console.error('INSERT ERROR:', e);
			return fail(500, { message: 'Gagal menyimpan data ke database.' });
		}

		throw redirect(303, '/manuver');
	}
};

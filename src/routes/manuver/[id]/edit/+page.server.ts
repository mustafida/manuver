import { db } from '$lib/server/db';
import { manuver, penyulang, garduInduk } from '$lib/server/db/schema';
import { desc, eq, aliasedTable, sql } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	if (!id) throw redirect(303, '/manuver');

	try {
		const m = await db.select().from(manuver).where(eq(manuver.id, id)).limit(1);
		if (!m || m.length === 0) throw redirect(303, '/manuver');

		const listPenyulang = await db
			.select({
				id: penyulang.id,
				nama: penyulang.nama,
				ulp: penyulang.ulp,
				trf: penyulang.trf,
				bebanSiang: penyulang.bebanSiang,
				bebanMalam: penyulang.bebanMalam,
				garduIndukId: penyulang.garduIndukId,
				garduIndukNama: garduInduk.nama
			})
			.from(penyulang)
			.leftJoin(garduInduk, eq(penyulang.garduIndukId, garduInduk.id))
			.orderBy(penyulang.ulp, penyulang.nama);

		const listGarduInduk = await db.select().from(garduInduk).orderBy(garduInduk.nama);

		return { listPenyulang, listGarduInduk, manuver: m[0] };
	} catch (error) {
		console.error('EDIT LOAD ERROR:', error);
		throw redirect(303, '/manuver');
	}
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const id = Number(params.id);
		const formData = await request.formData();

		const penyulangAsalId = Number(formData.get('penyulangAsalId'));
		const penyulangTujuanId = Number(formData.get('penyulangTujuanId'));
		const sectionAsal = formData.get('sectionAsal')?.toString()?.trim();
		const sectionTujuan = formData.get('sectionTujuan')?.toString()?.trim();
		const bebanSebelum = Number(formData.get('bebanSebelum'));
		const bebanAmpereManuver = Number(formData.get('bebanAmpereManuver'));
		const waktuManuverStr = formData.get('waktuManuver')?.toString();
		const pelaksanaanAsal = formData.get('pelaksanaanAsal')?.toString()?.trim();
		const pelaksanaanTujuan = formData.get('pelaksanaanTujuan')?.toString()?.trim();
		const keterangan = formData.get('keterangan')?.toString()?.trim();
		const ulpAsal = formData.get('ulpAsal')?.toString()?.trim();
		const ulpTujuan = formData.get('ulpTujuan')?.toString()?.trim();

		if (!penyulangAsalId) return fail(400, { message: 'Penyulang Asal wajib dipilih.' });
		if (!penyulangTujuanId) return fail(400, { message: 'Penyulang Tujuan wajib dipilih.' });
		if (penyulangAsalId === penyulangTujuanId) return fail(400, { message: 'Penyulang Asal dan Tujuan tidak boleh sama.' });
		if (!sectionAsal) return fail(400, { message: 'Section Asal wajib diisi.' });
		if (!sectionTujuan) return fail(400, { message: 'Section Tujuan wajib diisi.' });
		if (isNaN(bebanSebelum) || bebanSebelum <= 0) return fail(400, { message: 'Beban Existing harus angka > 0.' });
		if (isNaN(bebanAmpereManuver) || bebanAmpereManuver <= 0) return fail(400, { message: 'Beban Manuver harus angka > 0.' });
		if (!waktuManuverStr) return fail(400, { message: 'Waktu Manuver wajib diisi.' });
		if (!pelaksanaanAsal) return fail(400, { message: 'Metode Eksekusi Asal wajib dipilih.' });
		if (!pelaksanaanTujuan) return fail(400, { message: 'Metode Eksekusi Tujuan wajib dipilih.' });
		if (!keterangan) return fail(400, { message: 'Keterangan wajib diisi.' });

		try {
			const waktuManuver = new Date(waktuManuverStr + ":00+07:00");

			await db.transaction(async (tx) => {
				await tx.update(manuver).set({
					penyulangAsalId,
					penyulangTujuanId,
					sectionAsal,
					sectionTujuan,
					ulpAsal,
					ulpTujuan,
					waktuManuver,
					bebanAmpereManuver,
					bebanSebelum: bebanSebelum || 0,
					pelaksanaanAsal,
					pelaksanaanTujuan,
					keterangan
				}).where(eq(manuver.id, id));
			});

		} catch (e) {
			console.error('UPDATE ERROR:', e);
			return fail(500, { message: 'Gagal memperbarui data ke database.' });
		}

		throw redirect(303, '/manuver');
	}
};

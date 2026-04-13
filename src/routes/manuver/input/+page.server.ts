import { db } from '$lib/server/db';
import { manuver, penyulang, garduInduk } from '$lib/server/db/schema';
import { desc, eq, aliasedTable, sql } from 'drizzle-orm';
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
				bebanSiang: penyulang.bebanSiang,
				bebanMalam: penyulang.bebanMalam,
				garduIndukId: penyulang.garduIndukId,
				garduIndukNama: garduInduk.nama
			})
			.from(penyulang)
			.leftJoin(garduInduk, eq(penyulang.garduIndukId, garduInduk.id))
			.orderBy(penyulang.ulp, penyulang.nama);

		const listGarduInduk = await db.select().from(garduInduk).orderBy(garduInduk.nama);

		return { listPenyulang, listGarduInduk };
	} catch (error) {
		console.error('INPUT LOAD ERROR:', error);
		return { listPenyulang: [], listGarduInduk: [] };
	}
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const penyulangAsalId = Number(formData.get('penyulangAsalId'));
		const penyulangTujuanId = Number(formData.get('penyulangTujuanId'));
		const sectionAsal = formData.get('sectionAsal')?.toString()?.trim();
		const sectionTujuan = formData.get('sectionTujuan')?.toString()?.trim();
		const bebanSebelum = Number(formData.get('bebanSebelum'));
		const bebanAmpereManuver = Number(formData.get('bebanAmpereManuver'));
		const waktuManuverStr = formData.get('waktuManuver')?.toString();
		const waktuPenormalanStr = formData.get('waktuPenormalan')?.toString();
		const pelaksanaanAsal = formData.get('pelaksanaanAsal')?.toString()?.trim();
		const pelaksanaanTujuan = formData.get('pelaksanaanTujuan')?.toString()?.trim();
		const keterangan = formData.get('keterangan')?.toString()?.trim();

		// Validation according to gemini.md: "Semua field wajib"
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
			const waktuManuver = new Date(waktuManuverStr);
			const waktuPenormalan = waktuPenormalanStr ? new Date(waktuPenormalanStr) : null;

			await db.transaction(async (tx) => {
				const durasi = waktuPenormalan ? Math.floor((waktuPenormalan.getTime() - waktuManuver.getTime()) / (1000 * 60)) : null;

				await tx.insert(manuver).values({
					penyulangAsalId,
					penyulangTujuanId,
					sectionAsal,
					sectionTujuan,
					waktuManuver,
					waktuPenormalan,
					bebanAmpereManuver,
					bebanSebelum: bebanSebelum || 0,
					bebanSesudah: null, // Initial 
					pelaksanaanAsal,
					pelaksanaanTujuan,
					keterangan,
					durasi,
					status: waktuPenormalan ? 'NORMAL' : 'AKTIF'
				});

				// If it's AKTIF (manuver starting), adjust the penyulang loads
				if (!waktuPenormalan) {
					// 1. Deduct from Asal
					await tx.execute(sql`
						UPDATE penyulang 
						SET beban_sekarang = beban_sekarang - ${bebanAmpereManuver} 
						WHERE id = ${penyulangAsalId}
					`);
					// 2. Add to Tujuan
					await tx.execute(sql`
						UPDATE penyulang 
						SET beban_sekarang = beban_sekarang + ${bebanAmpereManuver} 
						WHERE id = ${penyulangTujuanId}
					`);
				}
			});

		} catch (e) {
			console.error('INSERT ERROR:', e);
			return fail(500, { message: 'Gagal menyimpan data ke database.' });
		}

		throw redirect(303, '/manuver');
	}
};

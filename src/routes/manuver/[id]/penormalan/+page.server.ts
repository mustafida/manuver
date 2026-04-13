import { db } from '$lib/server/db';
import { manuver, penyulang } from '$lib/server/db/schema';
import { eq, sql, aliasedTable } from 'drizzle-orm';
import { getIndonesianDate } from '$lib/utils/date';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	
	try {
		const p1 = aliasedTable(penyulang, 'p1');
		const p2 = aliasedTable(penyulang, 'p2');

		// Use a robust flat join to avoid preloading issues
		const results = await db.select({
			id: manuver.id,
			status: manuver.status,
			bebanAmpereManuver: manuver.bebanAmpereManuver,
			bebanSebelum: manuver.bebanSebelum,
			waktuManuver: manuver.waktuManuver,
			penyulangAsalNama: p1.nama,
			penyulangTujuanNama: p2.nama,
		})
		.from(manuver)
		.innerJoin(p1, eq(manuver.penyulangAsalId, p1.id))
		.innerJoin(p2, eq(manuver.penyulangTujuanId, p2.id))
		.where(eq(manuver.id, id))
		.limit(1);

		const data = results[0];

		if (!data || data.status !== 'AKTIF') {
			throw redirect(303, '/');
		}

		return { manuverData: data };
	} catch (error) {
		console.error('LOAD PENORMALAN ERROR:', error);
		if (error instanceof Error && (error as any).status === 303) throw error;
		throw redirect(303, '/manuver');
	}
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = Number(params.id);
		const formData = await request.formData();
		const waktuPenormalanStr = formData.get('waktuPenormalan') as string;

		let waktuPenormalan = getIndonesianDate();
		if (waktuPenormalanStr) {
			waktuPenormalan = new Date(waktuPenormalanStr + ":00+07:00");
		}

		try {
			// Fetch the maneuver details first to know how much to restore
			const record = await db.query.manuver.findFirst({
				where: eq(manuver.id, id)
			});

			if (!record) {
				return fail(404, { message: 'Data manuver tidak ditemukan' });
			}

			if (record.status === 'NORMAL') {
				return fail(400, { message: 'Manuver sudah dalam status NORMAL' });
			}

			await db.transaction(async (tx) => {
				// 1. Calculate duration safely
				const startVal = record.waktuManuver;
				const startDate = startVal instanceof Date ? startVal : new Date(startVal);
				const startTime = startDate.getTime();
				const endTime = waktuPenormalan.getTime();
				
				let durasi = 0;
				if (!isNaN(startTime) && !isNaN(endTime)) {
					durasi = Math.floor((endTime - startTime) / (1000 * 60));
				}

				// 2. Update maneuver status
				await tx.update(manuver).set({
					waktuPenormalan,
					status: 'NORMAL',
					durasi: Math.max(0, durasi)
				}).where(eq(manuver.id, id));

				// 3. Restore loads atomically
				await tx.update(penyulang)
					.set({ bebanSekarang: sql`${penyulang.bebanSekarang} + ${record.bebanAmpereManuver}` })
					.where(eq(penyulang.id, record.penyulangAsalId));

				await tx.update(penyulang)
					.set({ bebanSekarang: sql`${penyulang.bebanSekarang} - ${record.bebanAmpereManuver}` })
					.where(eq(penyulang.id, record.penyulangTujuanId));
			});
		} catch (error) {
			console.error('NORMALIZATION ERROR:', error);
			return fail(500, { message: 'Gagal memperbarui status manuver' });
		}

		throw redirect(303, '/manuver');
	}
};

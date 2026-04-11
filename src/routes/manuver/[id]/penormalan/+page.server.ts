import { db } from '$lib/server/db';
import { manuver, penyulang } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getIndonesianDate } from '$lib/utils/date';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const data = await db.query.manuver.findFirst({
		where: eq(manuver.id, Number(params.id)),
		with: {
			penyulangAsal: { with: { garduInduk: true } },
			penyulangTujuan: { with: { garduInduk: true } }
		}
	});

	if (!data || data.status !== 'AKTIF') {
		throw redirect(303, '/');
	}

	return { manuverData: data };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = Number(params.id);
		const formData = await request.formData();
		const bebanSesudah = Number(formData.get('bebanSesudah'));
		const waktuPenormalanStr = formData.get('waktuPenormalan') as string;

		let waktuPenormalan = getIndonesianDate();
		if (waktuPenormalanStr) {
			waktuPenormalan = new Date(waktuPenormalanStr);
		}

		if (isNaN(bebanSesudah)) {
			return fail(400, { message: 'Beban sesudah harus diisi dengan angka valid' });
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
				// 1. Update status and completion data
				const startTime = new Date(record.waktuManuver).getTime();
				const endTime = waktuPenormalan.getTime();
				const durasi = Math.floor((endTime - startTime) / (1000 * 60));

				await tx.update(manuver).set({
					bebanSesudah,
					waktuPenormalan,
					status: 'NORMAL',
					durasi: durasi > 0 ? durasi : 0
				}).where(eq(manuver.id, id));

				// 2. Restore loads (Reverse of input action)
				// Add back to Asal
				await tx.execute(sql`
					UPDATE penyulang 
					SET beban_sekarang = beban_sekarang + ${record.bebanAmpereManuver} 
					WHERE id = ${record.penyulangAsalId}
				`);

				// Remove from Tujuan
				await tx.execute(sql`
					UPDATE penyulang 
					SET beban_sekarang = beban_sekarang - ${record.bebanAmpereManuver} 
					WHERE id = ${record.penyulangTujuanId}
				`);
			});
		} catch (error) {
			console.error('NORMALIZATION ERROR:', error);
			return fail(500, { message: 'Gagal memperbarui status manuver' });
		}

		throw redirect(303, '/');
	}
};

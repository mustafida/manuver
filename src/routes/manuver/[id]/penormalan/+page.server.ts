import { db } from '$lib/server/db';
import { manuver } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
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
		redirect(303, '/');
	}

	return { manuverData: data };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const bebanSesudah = Number(formData.get('bebanSesudah'));
		const waktuPenormalanStr = formData.get('waktuPenormalan') as string;

		let waktuPenormalan = new Date();
		if (waktuPenormalanStr) {
			waktuPenormalan = new Date(waktuPenormalanStr);
		}

		if (isNaN(bebanSesudah)) {
			return fail(400, { message: 'Beban sesudah harus diisi dengan angka valid' });
		}

		await db.update(manuver).set({
			bebanSesudah,
			waktuPenormalan,
			status: 'NORMAL'
		}).where(eq(manuver.id, Number(params.id)));

		redirect(303, '/');
	}
};

import { db } from '$lib/server/db';
import { penyulang, garduInduk } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const listPenyulang = await db.query.penyulang.findMany({
		with: {
			garduInduk: true
		},
		orderBy: [desc(penyulang.id)]
	});

	const listGarduInduk = await db.query.garduInduk.findMany({
		orderBy: [desc(garduInduk.id)]
	});

	return { listPenyulang, listGarduInduk };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const nama = formData.get('nama') as string;
		const garduIndukId = Number(formData.get('garduIndukId'));
		const trf = formData.get('trf') as string;
		const inputArusSiang = Number(formData.get('inputArusSiang')) || null;
		const ulp = formData.get('ulp') as 'Bangkalan' | 'Kamal' | 'Blega' | 'Sampang' | 'Pamekasan' | 'Sumenep' | 'Ketapang' | 'Waru' | 'Ambunten';

		if (!nama || !garduIndukId || !ulp) return fail(400, { message: 'Data wajib belum diisi lengkap' });

		await db.insert(penyulang).values({ nama, garduIndukId, trf, inputArusSiang: inputArusSiang ?? null, ulp });
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (!id) return fail(400, { message: 'ID tidak valid' });

		await db.delete(penyulang).where(eq(penyulang.id, id));
	}
};

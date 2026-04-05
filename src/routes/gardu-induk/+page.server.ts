import { db } from '$lib/server/db';
import { garduInduk } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const records = await db.query.garduInduk.findMany({
		orderBy: [desc(garduInduk.id)]
	});
	return { records };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const nama = formData.get('nama') as string;
		if (!nama) return fail(400, { message: 'Nama harus diisi' });

		await db.insert(garduInduk).values({ nama });
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (!id) return fail(400, { message: 'ID tidak valid' });

		await db.delete(garduInduk).where(eq(garduInduk.id, id));
	}
};

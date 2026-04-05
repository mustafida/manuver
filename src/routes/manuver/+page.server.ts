import { db } from '$lib/server/db';
import { manuver, penyulang } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const listPenyulang = await db.query.penyulang.findMany({
		with: { garduInduk: true },
		orderBy: [desc(penyulang.nama)]
	});
	return { listPenyulang };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const penyulangAsalId = Number(formData.get('penyulangAsalId'));
		const penyulangTujuanId = Number(formData.get('penyulangTujuanId'));
		const bebanAmpereManuver = Number(formData.get('bebanAmpereManuver'));
		const bebanSebelum = Number(formData.get('bebanSebelum'));
		const keterangan = formData.get('keterangan') as string;
		const waktuManuver = new Date(formData.get('waktuManuver') as string);

		if (!penyulangAsalId || !penyulangTujuanId || isNaN(bebanAmpereManuver) || isNaN(bebanSebelum)) {
			return fail(400, { message: 'Data wajib belum diisi lengkap' });
		}

		await db.insert(manuver).values({
			penyulangAsalId,
			penyulangTujuanId,
			waktuManuver: isNaN(waktuManuver.getTime()) ? new Date() : waktuManuver,
			bebanAmpereManuver,
			bebanSebelum,
			keterangan,
			status: 'AKTIF'
		});

		redirect(303, '/');
	}
};

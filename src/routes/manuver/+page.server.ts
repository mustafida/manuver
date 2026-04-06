import { db } from '$lib/server/db';
import { manuver, penyulang } from '$lib/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		// Fetch all maneuvers with relations
		const listManuver = await db.select({
			id: manuver.id,
			waktuManuver: manuver.waktuManuver,
			waktuPenormalan: manuver.waktuPenormalan,
			bebanAmpereManuver: manuver.bebanAmpereManuver,
			status: manuver.status,
			penyulangAsal: { nama: sql<string>`p1.nama`, ulp: sql<string>`p1.ulp` },
			penyulangTujuan: { nama: sql<string>`p2.nama`, ulp: sql<string>`p2.ulp` },
		})
		.from(manuver)
		.innerJoin(sql`penyulang p1`, eq(manuver.penyulangAsalId, sql`p1.id`))
		.innerJoin(sql`penyulang p2`, eq(manuver.penyulangTujuanId, sql`p2.id`))
		.orderBy(desc(manuver.waktuManuver));

		// Fetch stats for the top cards
		const totalCountResult = await db.select({ count: sql<number>`count(*)` }).from(manuver);
		const activeCountResult = await db.select({ count: sql<number>`count(*)` }).from(manuver).where(eq(manuver.status, 'AKTIF'));
		const normalCountResult = await db.select({ count: sql<number>`count(*)` }).from(manuver).where(eq(manuver.status, 'NORMAL'));

		const stats = {
			total: totalCountResult[0]?.count || 0,
			active: activeCountResult[0]?.count || 0,
			normal: normalCountResult[0]?.count || 0
		};

		return { listManuver, stats };
	} catch (error) {
		console.error('LOAD MANUVER ERROR:', error);
		return { listManuver: [], stats: { total: 0, active: 0, normal: 0 } };
	}
};

export const actions: Actions = {
	// Action to mark as normal (used from both dashboard and list)
	normalize: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const bebanSesudah = Number(formData.get('bebanSesudah'));

		if (!id) return fail(400, { message: 'ID tidak ditemukan' });

		await db.update(manuver)
			.set({ 
				status: 'NORMAL', 
				waktuPenormalan: new Date(),
				bebanSesudah: bebanSesudah || 0
			})
			.where(eq(manuver.id, id));

		return { success: true };
	}
}

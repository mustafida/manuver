import { db } from '$lib/server/db';
import { garduInduk, penyulang, manuver } from '$lib/server/db/schema';
import { eq, or } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
        // Try to verify if table exists. If it fails, an error will be thrown and caught.
		let garduInduks = await db.select().from(garduInduk).catch(() => []);
		
		// If empty, let's proactively seed it so the user sees the 6 Gardu Induk as requested.
		if (garduInduks.length === 0) {
            try {
                await db.insert(garduInduk).values([
                    { nama: 'Bangkalan' },
                    { nama: 'Kamal' },
                    { nama: 'Blega' },
                    { nama: 'Sampang' },
                    { nama: 'Pamekasan' },
                    { nama: 'Sumenep' }
                ]).catch(() => {});
                // Refetch after seeding
                garduInduks = await db.select().from(garduInduk).catch(() => []);
            } catch (ignored) {}
		}

		const penyulangs = await db.select().from(penyulang).catch(() => []);
		const activeManeuvers = await db.select().from(manuver).where(eq(manuver.status, 'AKTIF')).catch(() => []);

		// Calculate counts natively in JS to avoid strict SQL group-by/BigInt errors
		const listGarduInduk = garduInduks.map(gi => {
			const count = penyulangs.filter(p => p.garduIndukId === gi.id).length;
			return {
				id: gi.id,
				nama: gi.nama,
				penyulangCount: count || 0
			};
		});

		// Join natively in JS
		const listPenyulang = penyulangs.map(p => {
			const gi = garduInduks.find(g => g.id === p.garduIndukId);
			const isSource = activeManeuvers.some(m => m.penyulangAsalId === p.id);
			const isTarget = activeManeuvers.some(m => m.penyulangTujuanId === p.id);

			return {
				id: p.id,
				nama: p.nama,
				ulp: p.ulp,
				bebanSiang: p.bebanSiang || 0,
				bebanMalam: p.bebanMalam || 0,
				bebanSekarang: p.bebanSekarang ?? 0,
				garduIndukNama: gi ? gi.nama : '-',
				isSource,
				isTarget
			};
		});

		return { listGarduInduk, listPenyulang };
	} catch (error) {
		console.error('SEVERE LOAD ERROR:', error);
		// Return empty arrays IF the database connection completely crashes so the user never sees 500
		return { listGarduInduk: [], listPenyulang: [] };
	}
};

export const actions: Actions = {
	deleteGI: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { message: 'Invalid ID' });

		try {
			const p = await db.select().from(penyulang).where(eq(penyulang.garduIndukId, id)).limit(1);
			if (p.length > 0) return fail(400, { message: 'Masih ada penyulang terkait!' });
			await db.delete(garduInduk).where(eq(garduInduk.id, id));
			return { success: true };
		} catch (e) {
			return fail(500, { message: 'Gagal dihapus' });
		}
	},
	deletePenyulang: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { message: 'Invalid ID' });

		try {
			await db.delete(penyulang).where(eq(penyulang.id, id));
			return { success: true };
		} catch (e) {
			return fail(500, { message: 'Gagal dihapus' });
		}
	}
};

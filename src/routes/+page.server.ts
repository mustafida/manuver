import { db } from '$lib/server/db';
import { manuver, penyulang } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		console.log('Fetching active manuvers...');
		const activeManuvers = await db.select({
			id: manuver.id,
			waktuManuver: manuver.waktuManuver,
			bebanAmpereManuver: manuver.bebanAmpereManuver,
			bebanSebelum: manuver.bebanSebelum,
			status: manuver.status,
			penyulangAsal: {
				nama: penyulang.nama
			},
			// This is just a test, simplified
		})
		.from(manuver)
		.leftJoin(penyulang, eq(manuver.penyulangAsalId, penyulang.id))
		.where(eq(manuver.status, 'AKTIF'));

		console.log('Query finished, count:', activeManuvers.length);

		return {
			activeManuvers: activeManuvers as any,
			historyManuvers: []
		};
	} catch (error) {
		console.error('SERVER LOAD ERROR:', error);
		throw error;
	}
};

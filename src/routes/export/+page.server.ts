import { db } from '$lib/server/db';
import { manuver, penyulang } from '$lib/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const listManuver = await db.select({
			id: manuver.id,
			waktuManuver: manuver.waktuManuver,
			waktuPenormalan: manuver.waktuPenormalan,
			bebanSebelum: manuver.bebanSebelum,
			bebanAmpereManuver: manuver.bebanAmpereManuver,
			bebanSesudah: manuver.bebanSesudah,
			section: manuver.section,
			pelaksanaan: manuver.pelaksanaan,
			keterangan: manuver.keterangan,
			status: manuver.status,
			penyulangAsal: { nama: sql<string>`p1.nama` },
			penyulangTujuan: { nama: sql<string>`p2.nama` },
		})
		.from(manuver)
		.innerJoin(sql`penyulang p1`, eq(manuver.penyulangAsalId, sql`p1.id`))
		.innerJoin(sql`penyulang p2`, eq(manuver.penyulangTujuanId, sql`p2.id`))
		.orderBy(desc(manuver.waktuManuver));

		return { listManuver };
	} catch (error) {
		console.error('LOAD EXPORT ERROR:', error);
		return { listManuver: [] };
	}
};

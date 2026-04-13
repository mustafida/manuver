import { db } from '$lib/server/db';
import { manuver, penyulang } from '$lib/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const listManuver = await db.select({
			id: manuver.id,
			waktuManuverStr: sql<string>`DATE_FORMAT(CONVERT_TZ(${manuver.waktuManuver}, '+00:00', '+07:00'), '%d/%m/%Y, %H:%i')`,
			waktuPenormalanStr: sql<string | null>`DATE_FORMAT(CONVERT_TZ(${manuver.waktuPenormalan}, '+00:00', '+07:00'), '%d/%m/%Y, %H:%i')`,
			bebanSebelum: manuver.bebanSebelum,
			bebanAmpereManuver: manuver.bebanAmpereManuver,
			bebanSesudah: manuver.bebanSesudah,
			sectionAsal: manuver.sectionAsal,
			sectionTujuan: manuver.sectionTujuan,
			pelaksanaanAsal: manuver.pelaksanaanAsal,
			pelaksanaanTujuan: manuver.pelaksanaanTujuan,
			keterangan: manuver.keterangan,
			durasi: manuver.durasi,
			status: manuver.status,
			penyulangAsalNama: sql<string>`p1.nama`,
			penyulangTujuanNama: sql<string>`p2.nama`,
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

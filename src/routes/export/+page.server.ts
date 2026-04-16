import { db } from '$lib/server/db';
import { manuver, penyulang } from '$lib/server/db/schema';
import { desc, eq, sql, aliasedTable, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	try {
		const month = url.searchParams.get('month');
		const year = url.searchParams.get('year');

		const p1 = aliasedTable(penyulang, 'p1');
		const p2 = aliasedTable(penyulang, 'p2');

		let query = db.select({
			id: manuver.id,
			waktuManuverStr: sql<string>`DATE_FORMAT(CONVERT_TZ(${manuver.waktuManuver}, '+00:00', '+07:00'), '%d/%m/%Y, %H:%i')`,
			waktuManuverTanggal: sql<string>`DATE_FORMAT(CONVERT_TZ(${manuver.waktuManuver}, '+00:00', '+07:00'), '%d/%m/%Y')`,
			waktuManuverJam: sql<string>`DATE_FORMAT(CONVERT_TZ(${manuver.waktuManuver}, '+00:00', '+07:00'), '%H:%i')`,
			waktuPenormalanStr: sql<string | null>`DATE_FORMAT(CONVERT_TZ(${manuver.waktuPenormalan}, '+00:00', '+07:00'), '%d/%m/%Y, %H:%i')`,
			waktuPenormalanTanggal: sql<string | null>`DATE_FORMAT(CONVERT_TZ(${manuver.waktuPenormalan}, '+00:00', '+07:00'), '%d/%m/%Y')`,
			waktuPenormalanJam: sql<string | null>`DATE_FORMAT(CONVERT_TZ(${manuver.waktuPenormalan}, '+00:00', '+07:00'), '%H:%i')`,
			bebanSebelum: manuver.bebanSebelum,
			bebanAmpereManuver: manuver.bebanAmpereManuver,
			sectionAsal: manuver.sectionAsal,
			sectionTujuan: manuver.sectionTujuan,
			pelaksanaanAsal: manuver.pelaksanaanAsal,
			pelaksanaanTujuan: manuver.pelaksanaanTujuan,
			sectionAsalPenormalan: manuver.sectionAsalPenormalan,
			sectionTujuanPenormalan: manuver.sectionTujuanPenormalan,
			pelaksanaanAsalPenormalan: manuver.pelaksanaanAsalPenormalan,
			pelaksanaanTujuanPenormalan: manuver.pelaksanaanTujuanPenormalan,
			keterangan: manuver.keterangan,
			durasi: manuver.durasi,
			status: manuver.status,
			penyulangAsalNama: p1.nama,
			penyulangAsalUlp: sql<string>`COALESCE(${manuver.ulpAsal}, ${p1.ulp})`,
			penyulangTujuanNama: p2.nama,
			penyulangTujuanUlp: sql<string>`COALESCE(${manuver.ulpTujuan}, ${p2.ulp})`,
		})
		.from(manuver)
		.leftJoin(p1, eq(manuver.penyulangAsalId, p1.id))
		.leftJoin(p2, eq(manuver.penyulangTujuanId, p2.id))
		.$dynamic();

		const filters = [];
		if (month && month !== 'all') {
			filters.push(sql`MONTH(CONVERT_TZ(${manuver.waktuManuver}, '+00:00', '+07:00')) = ${parseInt(month)}`);
		}
		if (year && year !== 'all') {
			filters.push(sql`YEAR(CONVERT_TZ(${manuver.waktuManuver}, '+00:00', '+07:00')) = ${parseInt(year)}`);
		}

		if (filters.length > 0) {
			query = query.where(and(...filters));
		}

		const listManuver = await query.orderBy(desc(manuver.waktuManuver));

		return { listManuver, filter: { month, year } };
	} catch (error) {
		console.error('LOAD EXPORT ERROR:', error);
		return { listManuver: [] };
	}
};

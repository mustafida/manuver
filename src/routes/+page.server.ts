import { db } from '$lib/server/db';
import { manuver, penyulang, garduInduk } from '$lib/server/db/schema';
import { eq, desc, sql, and, gte, or, aliasedTable } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// 1. Basic Counts
		const totalPenyulangResult = await db.select({ count: sql<number>`count(*)` }).from(penyulang);
		const totalGarduIndukResult = await db.select({ count: sql<number>`count(*)` }).from(garduInduk);
		const activeManuverCountResult = await db.select({ count: sql<number>`count(*)` }).from(manuver).where(eq(manuver.status, 'AKTIF'));

		const totalPenyulang = totalPenyulangResult[0]?.count || 0;
		const totalGarduInduk = totalGarduIndukResult[0]?.count || 0;
		const activeManuverCount = activeManuverCountResult[0]?.count || 0;

		// 2. Load Stats
		const loadStatsResult = await db.select({
			totalActiveLoad: sql<number>`sum(case when ${manuver.status} = 'AKTIF' then ${manuver.bebanAmpereManuver} else 0 end)`,
			avgLoad: sql<number>`avg(${manuver.bebanAmpereManuver})`,
			minLoad: sql<number>`min(${manuver.bebanAmpereManuver})`,
			maxLoad: sql<number>`max(${manuver.bebanAmpereManuver})`,
		}).from(manuver);

		const loadStats = loadStatsResult[0] || { totalActiveLoad: 0, avgLoad: 0, minLoad: 0, maxLoad: 0 };

		// 3. Duration Stats (Calculate difference in minutes)
		// MySQL TIMESTAMPDIFF(MINUTE, start, end)
		const durationStatsResult = await db.select({
			avgDuration: sql<number>`avg(TIMESTAMPDIFF(MINUTE, ${manuver.waktuManuver}, ${manuver.waktuPenormalan}))`,
			minDuration: sql<number>`min(TIMESTAMPDIFF(MINUTE, ${manuver.waktuManuver}, ${manuver.waktuPenormalan}))`,
			maxDuration: sql<number>`max(TIMESTAMPDIFF(MINUTE, ${manuver.waktuManuver}, ${manuver.waktuPenormalan}))`,
		}).from(manuver).where(sql`${manuver.waktuPenormalan} is not null`);

		const durationStats = durationStatsResult[0] || { avgDuration: 0, minDuration: 0, maxDuration: 0 };

		// 4. Manuver Bulan Ini
		const startOfMonth = new Date();
		startOfMonth.setDate(1);
		startOfMonth.setHours(0, 0, 0, 0);
		const currentMonthManuverResult = await db.select({ count: sql<number>`count(*)` })
			.from(manuver)
			.where(gte(manuver.waktuManuver, startOfMonth));
		
		const currentMonthManuver = currentMonthManuverResult[0]?.count || 0;

		// 5. Completion Ratio
		const totalManuverResult = await db.select({ count: sql<number>`count(*)` }).from(manuver);
		const totalManuver = totalManuverResult[0]?.count || 0;
		const normalManuverResult = await db.select({ count: sql<number>`count(*)` }).from(manuver).where(eq(manuver.status, 'NORMAL'));
		const normalManuver = normalManuverResult[0]?.count || 0;
		const completionRatio = totalManuver > 0 ? (normalManuver / totalManuver) * 100 : 100;

		// 6. Most Frequently Involved Feeders
		const [feederCounts] = await db.execute(sql`
			SELECT p.nama, COUNT(*) as count
			FROM (
				SELECT penyulang_asal_id as id FROM manuver
				UNION ALL
				SELECT penyulang_tujuan_id as id FROM manuver
			) as involved
			JOIN penyulang p ON p.id = involved.id
			GROUP BY p.nama
			ORDER BY count DESC
			LIMIT 5
		`);

		const p1 = aliasedTable(penyulang, 'p1');
		const p2 = aliasedTable(penyulang, 'p2');

		// 7. Active Manuvers (Live)
		const activeManuvers = await db.select({
			id: manuver.id,
			waktuManuver: manuver.waktuManuver,
			bebanAmpereManuver: manuver.bebanAmpereManuver,
			status: manuver.status,
			penyulangAsal: { nama: p1.nama },
			penyulangTujuan: { nama: p2.nama },
		})
		.from(manuver)
		.innerJoin(p1, eq(manuver.penyulangAsalId, p1.id))
		.innerJoin(p2, eq(manuver.penyulangTujuanId, p2.id))
		.where(eq(manuver.status, 'AKTIF'))
		.orderBy(desc(manuver.waktuManuver));

		// 8. Latest Normal History
		const normalHistory = await db.select({
			id: manuver.id,
			waktuManuver: manuver.waktuManuver,
			waktuPenormalan: manuver.waktuPenormalan,
			bebanAmpereManuver: manuver.bebanAmpereManuver,
			status: manuver.status,
			penyulangAsal: { nama: p1.nama },
			penyulangTujuan: { nama: p2.nama },
		})
		.from(manuver)
		.innerJoin(p1, eq(manuver.penyulangAsalId, p1.id))
		.innerJoin(p2, eq(manuver.penyulangTujuanId, p2.id))
		.where(eq(manuver.status, 'NORMAL'))
		.orderBy(desc(manuver.waktuPenormalan))
		.limit(5);

		return {
			stats: {
				totalPenyulang,
				totalGarduInduk,
				activeManuverCount,
				loadStats,
				durationStats,
				currentMonthManuver,
				completionRatio
			},
			topFeeders: feederCounts as any,
			activeManuvers: activeManuvers as any,
			normalHistory: normalHistory as any
		};
	} catch (error) {
		console.error('SERVER LOAD ERROR:', error);
		return {
			stats: {
				totalPenyulang: 0,
				totalGarduInduk: 0,
				activeManuverCount: 0,
				loadStats: { totalActiveLoad: 0, avgLoad: 0, minLoad: 0, maxLoad: 0 },
				durationStats: { avgDuration: 0, minDuration: 0, maxDuration: 0 },
				currentMonthManuver: 0,
				completionRatio: 0
			},
			topFeeders: [],
			activeManuvers: [],
			normalHistory: []
		};
	}
};

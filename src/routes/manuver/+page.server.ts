import { db } from '$lib/server/db';
import { manuver, penyulang } from '$lib/server/db/schema';
import { desc, eq, sql, aliasedTable } from 'drizzle-orm';
import { getIndonesianDate } from '$lib/utils/date';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		const p1 = aliasedTable(penyulang, 'p1');
		const p2 = aliasedTable(penyulang, 'p2');

		// Fetch all maneuvers with relations
		const listManuver = await db.select({
			id: manuver.id,
			sectionAsal: manuver.sectionAsal,
			sectionTujuan: manuver.sectionTujuan,
			// Split date and time for table display
			waktuManuverStr: sql<string>`DATE_FORMAT(CONVERT_TZ(${manuver.waktuManuver}, '+00:00', '+07:00'), '%d/%m/%Y, %H:%i')`,
			waktuManuverTanggal: sql<string>`DATE_FORMAT(CONVERT_TZ(${manuver.waktuManuver}, '+00:00', '+07:00'), '%d/%m/%Y')`,
			waktuManuverJam: sql<string>`DATE_FORMAT(CONVERT_TZ(${manuver.waktuManuver}, '+00:00', '+07:00'), '%H:%i')`,
			
			waktuPenormalanStr: sql<string | null>`DATE_FORMAT(CONVERT_TZ(${manuver.waktuPenormalan}, '+00:00', '+07:00'), '%d/%m/%Y, %H:%i')`,
			waktuPenormalanTanggal: sql<string | null>`DATE_FORMAT(CONVERT_TZ(${manuver.waktuPenormalan}, '+00:00', '+07:00'), '%d/%m/%Y')`,
			waktuPenormalanJam: sql<string | null>`DATE_FORMAT(CONVERT_TZ(${manuver.waktuPenormalan}, '+00:00', '+07:00'), '%H:%i')`,
			
			bebanSebelum: manuver.bebanSebelum,
			bebanAmpereManuver: manuver.bebanAmpereManuver,
			durasi: manuver.durasi,
			status: manuver.status,
			pelaksanaanAsal: manuver.pelaksanaanAsal,
			pelaksanaanTujuan: manuver.pelaksanaanTujuan,
			sectionAsalPenormalan: manuver.sectionAsalPenormalan,
			sectionTujuanPenormalan: manuver.sectionTujuanPenormalan,
			pelaksanaanAsalPenormalan: manuver.pelaksanaanAsalPenormalan,
			pelaksanaanTujuanPenormalan: manuver.pelaksanaanTujuanPenormalan,
			keterangan: manuver.keterangan,
			penyulangAsalNama: p1.nama,
			penyulangAsalUlp: sql<string>`COALESCE(${manuver.ulpAsal}, ${p1.ulp})`,
			penyulangTujuanNama: p2.nama,
			penyulangTujuanUlp: sql<string>`COALESCE(${manuver.ulpTujuan}, ${p2.ulp})`,
		})
		.from(manuver)
		.leftJoin(p1, eq(manuver.penyulangAsalId, p1.id))
		.leftJoin(p2, eq(manuver.penyulangTujuanId, p2.id))
		.orderBy(desc(manuver.waktuManuver));

		// Fetch stats for the top cards
		const totalCount = await db.select({ value: sql`count(*)` }).from(manuver);
		const activeCount = await db.select({ value: sql`count(*)` }).from(manuver).where(eq(manuver.status, 'AKTIF'));
		const normalCount = await db.select({ value: sql`count(*)` }).from(manuver).where(eq(manuver.status, 'NORMAL'));

		const stats = {
			total: Number(totalCount[0]?.value || 0),
			active: Number(activeCount[0]?.value || 0),
			normal: Number(normalCount[0]?.value || 0)
		};

		return { listManuver, stats };
	} catch (error) {
		console.error('LOAD MANUVER ERROR:', error);
		// Return dummy empty state instead of crashing 500
		return { 
			listManuver: [], 
			stats: { total: 0, active: 0, normal: 0 },
			error: 'Gagal memuat data dari database'
		};
	}
};

export const actions: Actions = {
	// Action to mark as normal (used from both dashboard and list)
	normalize: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { message: 'ID tidak ditemukan' });

		try {
			await db.transaction(async (tx) => {
				// 1. Get the maneuver details to know the amount and IDs
				const [m] = await tx.select().from(manuver).where(eq(manuver.id, id)).limit(1);
				if (!m || m.status === 'NORMAL') return;

				// 2. Calculate duration safely
				const now = getIndonesianDate();
				const startVal = m.waktuManuver;
				const startDate = startVal instanceof Date ? startVal : new Date(startVal);
				const startTime = startDate.getTime();
				const nowTime = now.getTime();
				
				let durasi = 0;
				if (!isNaN(startTime) && !isNaN(nowTime)) {
					durasi = Math.floor((nowTime - startTime) / (1000 * 60));
				}

				// 3. Update status
				await tx.update(manuver)
					.set({ 
						status: 'NORMAL', 
						waktuPenormalan: now,
						durasi: Math.max(0, durasi)
					})
					.where(eq(manuver.id, id));

				// 4. RESTORE LOADS ATOMICALLY
				// Add back to Asal
				await tx.update(penyulang)
					.set({ bebanSekarang: sql`${penyulang.bebanSekarang} + ${m.bebanAmpereManuver}` })
					.where(eq(penyulang.id, m.penyulangAsalId));

				// Deduct from Tujuan
				await tx.update(penyulang)
					.set({ bebanSekarang: sql`${penyulang.bebanSekarang} - ${m.bebanAmpereManuver}` })
					.where(eq(penyulang.id, m.penyulangTujuanId));
			});

			return { success: true };
		} catch (e) {
			console.error('NORMALIZATION ERROR:', e);
			return fail(500, { message: 'Gagal melakukan penormalan.' });
		}
	},

	// Action to delete a maneuver record
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { message: 'ID tidak ditemukan' });

		try {
			await db.delete(manuver).where(eq(manuver.id, id));
			return { success: true };
		} catch (e) {
			console.error('DELETE ERROR:', e);
			return fail(500, { message: 'Gagal menghapus data manuver.' });
		}
	}
};

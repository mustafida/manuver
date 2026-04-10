import { db } from '$lib/server/db';
import { manuver, penyulang } from '$lib/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import ExcelJS from 'exceljs';

export const GET: RequestHandler = async () => {
	try {
		const listManuver = await db.select({
			id: manuver.id,
			waktuManuver: manuver.waktuManuver,
			waktuPenormalan: manuver.waktuPenormalan,
			bebanSebelum: manuver.bebanSebelum,
			bebanAmpereManuver: manuver.bebanAmpereManuver,
			bebanSesudah: manuver.bebanSesudah,
			sectionAsal: manuver.sectionAsal,
			sectionTujuan: manuver.sectionTujuan,
			pelaksanaan: manuver.pelaksanaan,
			keterangan: manuver.keterangan,
			durasi: manuver.durasi,
			status: manuver.status,
			penyulangAsalNama: sql<string>`p1.nama`,
			penyulangAsalUlp: sql<string>`p1.ulp`,
			penyulangTujuanNama: sql<string>`p2.nama`,
			penyulangTujuanUlp: sql<string>`p2.ulp`,
		})
		.from(manuver)
		.innerJoin(sql`penyulang p1`, eq(manuver.penyulangAsalId, sql`p1.id`))
		.innerJoin(sql`penyulang p2`, eq(manuver.penyulangTujuanId, sql`p2.id`))
		.orderBy(desc(manuver.waktuManuver));

		const formatDatePart = (date: Date | null) => {
			if (!date) return '-';
			return new Date(date).toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }).split(' ')[0];
		};

		const formatTimePart = (date: Date | null) => {
			if (!date) return '-';
			const time = new Date(date).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' });
			return time.replace('.', ':');
		};

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('Riwayat Manuver');

		// Mendefinisikan Kolom beserta lebarnya (tanpa header karena kita mau merge)
		worksheet.columns = [
			{ key: 'no', width: 5 },
			{ key: 'asal_ulp', width: 15 },
			{ key: 'asal_penyulang', width: 25 },
			{ key: 'tujuan_ulp', width: 15 },
			{ key: 'tujuan_penyulang', width: 25 },
			{ key: 'section_asal', width: 15 },
			{ key: 'section_tujuan', width: 15 },
			{ key: 'beban_sebelum', width: 16 },
			{ key: 'beban_manuver', width: 16 },
			{ key: 'tanggal_manuver', width: 15 },
			{ key: 'jam_manuver', width: 10 },
			{ key: 'tanggal_normal', width: 15 },
			{ key: 'jam_normal', width: 10 },
			{ key: 'pelaksanaan', width: 20 },
			{ key: 'durasi', width: 15 },
			{ key: 'keterangan', width: 40 }
		];

		// Membangun Header Baris 1
		worksheet.getRow(1).values = [
			'NO', 'EXISTING', '', 'MANUVER KE', '', 'SECTION', '', 'BEBAN EXISTING', 'BEBAN MANUVER',
			'WAKTU MANUVER', '', 'WAKTU PENORMALAN MANUVER', '', 'EKSEKUSI', 'DURASI (MENIT)', 'KETERANGAN'
		];

		// Membangun Header Baris 2
		worksheet.getRow(2).values = [
			'', 'ULP', 'PENYULANG', 'ULP', 'PENYULANG', 'ASAL', 'TUJUAN', '', '',
			'TANGGAL', 'JAM', 'TANGGAL', 'JAM', '', '', ''
		];

		// Gabungkan (Merge) Cell yang Kosong
		worksheet.mergeCells('A1:A2'); // NO
		worksheet.mergeCells('B1:C1'); // EXISTING
		worksheet.mergeCells('D1:E1'); // MANUVER KE
		worksheet.mergeCells('F1:G1'); // SECTION
		worksheet.mergeCells('H1:H2'); // BEBAN EXISTING
		worksheet.mergeCells('I1:I2'); // BEBAN MANUVER
		worksheet.mergeCells('J1:K1'); // WAKTU MANUVER
		worksheet.mergeCells('L1:M1'); // WAKTU PENORMALAN
		worksheet.mergeCells('N1:N2'); // EKSEKUSI
		worksheet.mergeCells('O1:O2'); // DURASI
		worksheet.mergeCells('P1:P2'); // KETERANGAN

		// Styling Header Custom (Baris 1 & 2)
		const borderDashedStyle = { style: 'mediumDashed' } as any;

		[1, 2].forEach(rowIdx => {
			worksheet.getRow(rowIdx).eachCell({ includeEmpty: true }, (cell) => {
				cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
				cell.fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'FF0070C0' } // Warna Biru Gelap Excel Default
				};
				cell.alignment = { vertical: 'middle', horizontal: 'center' };
				cell.border = {
					top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
					left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
					bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
					right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
				};
			});
		});

		// Memasukkan data ke baris-baris berikutnya
		listManuver.forEach((m, index) => {
			const row = worksheet.addRow({
				no: index + 1,
				asal_ulp: m.penyulangAsalUlp,
				asal_penyulang: m.penyulangAsalNama,
				tujuan_ulp: m.penyulangTujuanUlp,
				tujuan_penyulang: m.penyulangTujuanNama,
				section_asal: m.sectionAsal || '-',
				section_tujuan: m.sectionTujuan || '-',
				beban_sebelum: m.bebanSebelum,
				beban_manuver: m.bebanAmpereManuver,
				tanggal_manuver: formatDatePart(m.waktuManuver),
				jam_manuver: formatTimePart(m.waktuManuver),
				tanggal_normal: m.status === 'NORMAL' ? formatDatePart(m.waktuPenormalan) : '-',
				jam_normal: m.status === 'NORMAL' ? formatTimePart(m.waktuPenormalan) : '-',
				pelaksanaan: m.pelaksanaan || '-',
				durasi: m.status === 'NORMAL' ? (m.durasi ?? '-') : 'PROSES',
				keterangan: m.keterangan || '-'
			});

			// Styling untuk setiap cell di baris data menggunakan border dashed
			row.eachCell((cell, colNumber) => {
				cell.border = {
					top: { style: 'hair', color: {argb: 'FF000000'} },
					left: { style: 'hair', color: {argb: 'FF000000'} },
					bottom: { style: 'hair', color: {argb: 'FF000000'} },
					right: { style: 'hair', color: {argb: 'FF000000'} }
				};

				// Rata tengah
				if ([1, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(colNumber)) {
					cell.alignment = { vertical: 'middle', horizontal: 'center' };
				} else {
					cell.alignment = { vertical: 'middle', horizontal: 'left' };
				}
			});
		});

		// Menghasilkan file bentuk buffer
		const buffer = await workbook.xlsx.writeBuffer();

		return new Response(buffer, {
			headers: {
				'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition': `attachment; filename="Data_Manuver_${new Date().getTime()}.xlsx"`
			}
		});

	} catch (error) {
		console.error('EXPORT EXCEL ERROR:', error);
		return new Response('Error generating export file', { status: 500 });
	}
};

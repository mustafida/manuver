import { db } from '$lib/server/db';
import { manuver, penyulang } from '$lib/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { formatWibDate, formatWibTime } from '$lib/utils/date';
import ExcelJS from 'exceljs';

export const GET: RequestHandler = async () => {
    try {
        const listManuver = await db.select({
            id: manuver.id,
            waktuManuver: manuver.waktuManuver,
            waktuPenormalan: manuver.waktuPenormalan,
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
            penyulangAsalNama: sql<string>`p1.nama`,
            penyulangAsalUlp: sql<string>`COALESCE(manuver.ulp_asal, p1.ulp)`,
            penyulangTujuanNama: sql<string>`p2.nama`,
            penyulangTujuanUlp: sql<string>`COALESCE(manuver.ulp_tujuan, p2.ulp)`,
        })
        .from(manuver)
        .innerJoin(sql`penyulang p1`, eq(manuver.penyulangAsalId, sql`p1.id`))
        .innerJoin(sql`penyulang p2`, eq(manuver.penyulangTujuanId, sql`p2.id`))
        .orderBy(desc(manuver.waktuManuver));

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Riwayat Manuver');

        // Mendefinisikan Kolom
        worksheet.columns = [
            { key: 'no', width: 8 },
            { key: 'asal_ulp', width: 22 },
            { key: 'asal_penyulang', width: 35 },
            { key: 'tujuan_ulp', width: 22 },
            { key: 'tujuan_penyulang', width: 35 },
            { key: 'beban_sebelum', width: 20 },
            { key: 'beban_manuver', width: 20 },
            // MANUVER Columns
            { key: 'm_tanggal', width: 20 },
            { key: 'm_jam', width: 14 },
            { key: 'm_sec_asal', width: 25 },
            { key: 'm_sec_tujuan', width: 25 },
            { key: 'm_eks_asal', width: 25 },
            { key: 'm_eks_tujuan', width: 25 },
            // NORMAL Columns
            { key: 'n_tanggal', width: 20 },
            { key: 'n_jam', width: 14 },
            { key: 'n_sec_asal', width: 25 },
            { key: 'n_sec_tujuan', width: 25 },
            { key: 'n_eks_asal', width: 25 },
            { key: 'n_eks_tujuan', width: 25 },
            // END
            { key: 'durasi', width: 20 },
            { key: 'keterangan', width: 50 }
        ];

        // Baris 1: Main Groups
        worksheet.getRow(1).values = [
            'NO', 'EXISTING (ASAL)', '', 'MANUVER KE (TUJUAN)', '', 'BEBAN (AMPERE)', '', 
            'PROSES MANUVER AWAL', '', '', '', '', '',
            'PROSES PENORMALAN', '', '', '', '', '',
            'DURASI (MENIT)', 'KETERANGAN'
        ];

        // Baris 2: Detailed Columns
        worksheet.getRow(2).values = [
            '', 'ULP', 'PENYULANG', 'ULP', 'PENYULANG', 'BEBAN EXISTING', 'BEBAN MANUVER',
            'TANGGAL', 'JAM', 'SECTION ASAL', 'SECTION TUJUAN', 'EKSEKUSI ASAL', 'EKSEKUSI TUJUAN',
            'TANGGAL', 'JAM', 'SECTION ASAL', 'SECTION TUJUAN', 'EKSEKUSI ASAL', 'EKSEKUSI TUJUAN',
            '', ''
        ];

        // Merge Columns Row 1
        worksheet.mergeCells('A1:A2'); // NO
        worksheet.mergeCells('B1:C1'); // EXISTING
        worksheet.mergeCells('D1:E1'); // MANUVER KE
        worksheet.mergeCells('F1:G1'); // BEBAN
        worksheet.mergeCells('H1:M1'); // MANUVER AWAL
        worksheet.mergeCells('N1:S1'); // PENORMALAN
        worksheet.mergeCells('T1:T2'); // DURASI
        worksheet.mergeCells('U1:U2'); // KETERANGAN

        // Custom Header Styling
        [1, 2].forEach(rowIdx => {
            worksheet.getRow(rowIdx).eachCell({ includeEmpty: true }, (cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 13 };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF0070C0' }
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

        // Insert Data
        listManuver.forEach((m, index) => {
            const isNormal = m.status === 'NORMAL';
            const rowData = {
                no: index + 1,
                asal_ulp: m.penyulangAsalUlp,
                asal_penyulang: m.penyulangAsalNama,
                tujuan_ulp: m.penyulangTujuanUlp,
                tujuan_penyulang: m.penyulangTujuanNama,
                beban_sebelum: m.bebanSebelum,
                beban_manuver: m.bebanAmpereManuver,
                // Manuver
                m_tanggal: formatWibDate(m.waktuManuver),
                m_jam: formatWibTime(m.waktuManuver),
                m_sec_asal: m.sectionAsal || '-',
                m_sec_tujuan: m.sectionTujuan || '-',
                m_eks_asal: m.pelaksanaanAsal || '-',
                m_eks_tujuan: m.pelaksanaanTujuan || '-',
                // Normal
                n_tanggal: isNormal ? formatWibDate(m.waktuPenormalan) : '-',
                n_jam: isNormal ? formatWibTime(m.waktuPenormalan) : '-',
                n_sec_asal: (isNormal ? m.sectionAsalPenormalan : null) || '-',
                n_sec_tujuan: (isNormal ? m.sectionTujuanPenormalan : null) || '-',
                n_eks_asal: (isNormal ? m.pelaksanaanAsalPenormalan : null) || '-',
                n_eks_tujuan: (isNormal ? m.pelaksanaanTujuanPenormalan : null) || '-',
                // End
                durasi: isNormal ? (m.durasi ?? '-') : 'AKTIF',
                keterangan: m.keterangan || '-'
            };

            const row = worksheet.addRow(rowData);
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'hair' },
                    left: { style: 'hair' },
                    bottom: { style: 'hair' },
                    right: { style: 'hair' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.font = { size: 12 };
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();

        return new Response(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="Laporan_Manuver_${new Date().toISOString().split('T')[0]}.xlsx"`
            }
        });

    } catch (error) {
        console.error('EXPORT EXCEL ERROR:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};

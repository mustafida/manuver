import 'dotenv/config';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from '../src/lib/server/db/schema';
import { sql } from 'drizzle-orm';

const dataRaw = [
    { gi: 'GILI TIMUR', trf: '1', ulp: 'BANGKALAN', penyulang: 'MADURATEK' },
    { gi: 'GILI TIMUR', trf: '1', ulp: 'KAMAL', penyulang: 'UNIBANG' },
    { gi: 'GILI TIMUR', trf: '2', ulp: 'KAMAL', penyulang: 'KAMAL' },
    { gi: 'GILI TIMUR', trf: '2', ulp: 'KAMAL', penyulang: 'SEKARBUNGU' },
    { gi: 'GILI TIMUR', trf: '2', ulp: 'BANGKALAN', penyulang: 'MARTADINATA' },
    { gi: 'BANGKALAN', trf: '1', ulp: 'BANGKALAN', penyulang: 'AROSBAYA' },
    { gi: 'BANGKALAN', trf: '1', ulp: 'BANGKALAN', penyulang: 'SURAMADU' },
    { gi: 'BANGKALAN', trf: '1', ulp: 'KAMAL', penyulang: 'LABANG' },
    { gi: 'BANGKALAN', trf: '1', ulp: 'BANGKALAN', penyulang: 'TRAGEH' },
    { gi: 'BANGKALAN', trf: '1', ulp: 'BANGKALAN', penyulang: 'TANJUNG BUMI' },
    { gi: 'BANGKALAN', trf: '1', ulp: 'KETAPANG', penyulang: 'TANAH MERAH' },
    { gi: 'BANGKALAN', trf: '1', ulp: 'BANGKALAN', penyulang: 'ALAS KEMBANG' },
    { gi: 'BANGKALAN', trf: '2', ulp: 'BANGKALAN-KETAPANG', penyulang: 'PARSEH' },
    { gi: 'BANGKALAN', trf: '2', ulp: 'BANGKALAN', penyulang: 'GEGER' },
    { gi: 'BANGKALAN', trf: '2', ulp: 'BLEGA', penyulang: 'GALIS' },
    { gi: 'BANGKALAN', trf: '2', ulp: 'BANGKALAN', penyulang: 'PEMUDA KAFFA' },
    { gi: 'BANGKALAN', trf: '2', ulp: 'BANGKALAN', penyulang: 'ALANG-ALANG' },
    { gi: 'BANGKALAN', trf: '2', ulp: 'BANGKALAN', penyulang: 'MERANDUNG' },
    { gi: 'SAMPANG', trf: '1', ulp: 'SAMPANG', penyulang: 'WIJAYA KUSUMA' },
    { gi: 'SAMPANG', trf: '1', ulp: 'SAMPANG', penyulang: 'OMBEN' },
    { gi: 'SAMPANG', trf: '1', ulp: 'SAMPANG', penyulang: 'KEDUNDUNG' },
    { gi: 'SAMPANG', trf: '1', ulp: 'SAMPANG', penyulang: 'AENG SAREH' },
    { gi: 'SAMPANG', trf: '1', ulp: 'SAMPANG', penyulang: 'BANYUATES' },
    { gi: 'SAMPANG', trf: '2', ulp: 'SAMPANG', penyulang: 'KEMUNING' },
    { gi: 'SAMPANG', trf: '2', ulp: 'SAMPANG', penyulang: 'BANYUMAS' },
    { gi: 'SAMPANG', trf: '2', ulp: 'BLEGA', penyulang: 'BLEGA' },
    { gi: 'SAMPANG', trf: '2', ulp: 'SAMPANG-KETAPANG', penyulang: 'BIREM' },
    { gi: 'SAMPANG', trf: '2', ulp: 'KETAPANG', penyulang: 'KETAPANG' },
    { gi: 'SAMPANG', trf: '2', ulp: 'SAMPANG', penyulang: 'PAYUDAN' },
    { gi: 'SAMPANG', trf: '2', ulp: 'SAMPANG-BLEGA', penyulang: 'TORJUN' },
    { gi: 'PAMEKASAN', trf: '1', ulp: 'PAMEKASAN', penyulang: 'PROPPO' },
    { gi: 'PAMEKASAN', trf: '1', ulp: 'PAMEKASAN', penyulang: 'GAZALI' },
    { gi: 'PAMEKASAN', trf: '1', ulp: 'PAMEKASAN', penyulang: 'CANDI BURUNG' },
    { gi: 'PAMEKASAN', trf: '1', ulp: 'PAMEKASAN', penyulang: 'SUMEDANGAN' },
    { gi: 'PAMEKASAN', trf: '1', ulp: 'PAMEKASAN', penyulang: 'BANYU ANYAR' },
    { gi: 'PAMEKASAN', trf: '1', ulp: 'PAMEKASAN', penyulang: 'APUNG' },
    { gi: 'PAMEKASAN', trf: '2', ulp: 'PAMEKASAN', penyulang: 'BLUMBUNGAN' },
    { gi: 'PAMEKASAN', trf: '2', ulp: 'WARU-KETAPANG', penyulang: 'PEGANTENAN' },
    { gi: 'PAMEKASAN', trf: '2', ulp: 'WARU', penyulang: 'PAKONG' },
    { gi: 'PAMEKASAN', trf: '2', ulp: 'PAMEKASAN-SAMPANG-KETAPANG', penyulang: 'PALENGAAN' },
    { gi: 'PAMEKASAN', trf: '2', ulp: 'PAMEKASAN', penyulang: 'AREK LANCOR' },
    { gi: 'PAMEKASAN', trf: '2', ulp: 'PAMEKASAN-SAMPANG-WARU', penyulang: 'BATU AMPAR' },
    { gi: 'PAMEKASAN', trf: '2', ulp: 'PAMEKASAN', penyulang: 'PAHLAWAN' },
    { gi: 'SUMENEP', trf: '1', ulp: 'SUMENEP', penyulang: 'SARONGGI' },
    { gi: 'SUMENEP', trf: '1', ulp: 'SUMENEP', penyulang: 'KALIANGET' },
    { gi: 'SUMENEP', trf: '1', ulp: 'SUMENEP-AMBUNTEN-WARU', penyulang: 'RUBARU' },
    { gi: 'SUMENEP', trf: '1', ulp: 'SUMENEP', penyulang: 'WIRARAJA' },
    { gi: 'SUMENEP', trf: '1', ulp: 'SUMENEP', penyulang: 'BLUTO' },
    { gi: 'SUMENEP', trf: '1', ulp: 'SUMENEP', penyulang: 'BATANG BATANG' },
    { gi: 'SUMENEP', trf: '2', ulp: 'SUMENEP', penyulang: 'SUMEKAR' },
    { gi: 'SUMENEP', trf: '2', ulp: 'AMBUNTEN', penyulang: 'BATUPUTIH' },
    { gi: 'SUMENEP', trf: '2', ulp: 'SUMENEP', penyulang: 'DUNGKEK' },
    { gi: 'SUMENEP', trf: '2', ulp: 'AMBUNTEN', penyulang: 'AMBUNTEN' },
    { gi: 'SUMENEP', trf: '2', ulp: 'SUMENEP', penyulang: 'LENTENG' },
    { gi: 'SUMENEP', trf: '2', ulp: 'SUMENEP', penyulang: 'SULTAN' },
    { gi: 'SUMENEP', trf: '2', ulp: 'SUMENEP', penyulang: 'TALANGO' },
    { gi: 'GULUK-GULUK', trf: '1', ulp: 'WARU', penyulang: 'BANDUNGAN' },
    { gi: 'GULUK-GULUK', trf: '1', ulp: 'AMBUNTEN', penyulang: 'PRANCAK' },
    { gi: 'GULUK-GULUK', trf: '1', ulp: 'SUMENEP', penyulang: 'GANDING' },
    { gi: 'GULUK-GULUK', trf: '1', ulp: 'SUMENEP', penyulang: 'PRAGAAN' },
];

async function main() {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');
    const client = mysql.createPool(DATABASE_URL);
    const db = drizzle(client, { schema, mode: 'default' });

	console.log('Altering penyulang ULP column to VARCHAR...');
    try {
        await db.execute(sql`ALTER TABLE penyulang MODIFY ulp VARCHAR(255) NOT NULL;`);
    } catch(e: any) {
        console.log('Altering column failed. Might be ok. Error:', e.message);
    }

	console.log('Clearing existing data...');
    try {
        await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0;`);
        await db.delete(schema.manuver);
	    await db.delete(schema.penyulang);
	    await db.delete(schema.garduInduk);
        await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);
    } catch (e) {
        console.error('Clearing data failed', e);
    }

	console.log('Seeding new data...');

    const giMap = new Map<string, number>();

	for (const item of dataRaw) {
        if (!giMap.has(item.gi)) {
            const [giResult] = await db.insert(schema.garduInduk).values({ nama: item.gi }).$returningId();
            giMap.set(item.gi, giResult.id);
        }

        const giId = giMap.get(item.gi)!;

        await db.insert(schema.penyulang).values({
            nama: item.penyulang,
            garduIndukId: giId,
            trf: item.trf,
            ulp: item.ulp.trim()
        });

		console.log(`Penyulang: ${item.penyulang} (GI: ${item.gi}, ULP: ${item.ulp}) Selesai.`);
	}

	console.log('==== Seeding Master Data Selesai ====');
    client.end();
	process.exit(0);
}

main().catch((err) => {
	console.error('Seeding error:', err);
	process.exit(1);
});

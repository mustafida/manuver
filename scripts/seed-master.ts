import { db } from '../src/lib/server/db';
import { garduInduk, penyulang, manuver } from '../src/lib/server/db/schema';
import { sql } from 'drizzle-orm';

const dataMaster = [
	{
		gi: 'GILI TIMUR',
		ulp: 'BANGKALAN, KAMAL',
		penyulang: ['MADURATEK', 'UNIBANG', 'KAMAL', 'SEKARBUNGU', 'MARTADINATA']
	},
	{
		gi: 'SAMPANG',
		ulp: 'SAMPANG, BLEGA, SAMPANG-KETAPANG, KETAPANG,SAMPANG-BLEGA',
		penyulang: ['WIJAYA KUSUMA', 'OMBEN', 'KEDUNDUNG', 'AENG SAREH', 'BANYUATES', 'KEMUNING', 'BANYUMAS', 'BLEGA', 'BIREM', 'KETAPANG', 'PAYUDAN', 'TORJUN']
	},
	{
		gi: 'BANGKALAN',
		ulp: 'BANGKALAN, KAMAL, KETAPANG, BANGKALAN-KETAPANG, BLEGA',
		penyulang: ['AROSBAYA', 'SURAMADU', 'LABANG', 'TRAGEH', 'TANJUNG BUMI', 'TANAH MERAH', 'ALAS KEMBANG', 'PARSEH', 'GEGER', 'GALIS', 'PEMUDA KAFFA', 'ALANG-ALANG', 'MERANDUNG']
	},
	{
		gi: 'PAMEKASAN',
		ulp: 'PAMEKASAN, WARU-KETAPANG, WARU, PAMEKASAN-SAMPANG-KETAPANG, PAMEKASAN-SAMPANG-WARU',
		penyulang: ['PROPPO', 'GAZALI', 'CANDI BURUNG', 'SUMEDANGAN', 'BANYU ANYAR', 'APUNG', 'BLUMBUNGAN', 'PEGANTENAN', 'PAKONG', 'PALENGAAN', 'AREK LANCOR', 'BATU AMPAR', 'PAHLAWAN']
	},
	{
		gi: 'SUMENEP',
		ulp: 'SUMENEP, SUMENEP-AMBUNTEN-WARU, AMBUNTEN',
		penyulang: ['SARONGGI', 'KALIANGET', 'RUBARU', 'WIRARAJA', 'BLUTO', 'BATANG BATANG', 'SUMEKAR', 'BATUPUTIH', 'DUNGKEK', 'AMBUNTEN', 'LENTENG', 'SULTAN', 'TALANGO']
	},
	{
		gi: 'GULUK-GULUK',
		ulp: 'WARU, AMBUNTEN, SUMENEP',
		penyulang: ['BANDUNGAN', 'PRANCAK', 'GANDING', 'PRAGAAN']
	}
];

async function main() {
	console.log('Altering penyulang ULP column to VARCHAR...');
    try {
        await db.execute(sql`ALTER TABLE penyulang MODIFY ulp VARCHAR(255) NOT NULL;`);
    } catch(e) {
        console.log('Altering column failed. Might be ok. Error:', e.message);
    }

	console.log('Clearing existing data...');
    try {
        // Drop foreign keys/manuver to avoid constraints during deletion?
        await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0;`);
        await db.delete(manuver);
	    await db.delete(penyulang);
	    await db.delete(garduInduk);
        await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);
    } catch (e) {
        console.error('Clearing data failed', e);
    }

	console.log('Seeding new data...');

	for (const item of dataMaster) {
		const [gi] = await db.insert(garduInduk).values({ nama: item.gi }).$returningId();
		const giId = gi.id;

		const penyulangData = item.penyulang.map(p => ({
			nama: p,
			garduIndukId: giId,
			ulp: item.ulp // Storing the joined ULP string here
		}));

		if (penyulangData.length > 0) {
			await db.insert(penyulang).values(penyulangData);
		}

		console.log(`Penyisipan GI: ${item.gi} beserta ${item.penyulang.length} Penyulang Selesai.`);
	}

	console.log('==== Seeding Master Data Selesai ====');
	process.exit(0);
}

main().catch((err) => {
	console.error('Seeding error:', err);
	process.exit(1);
});

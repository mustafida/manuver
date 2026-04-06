const mysql = require('mysql2/promise');

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

async function seed() {
    const conn = await mysql.createConnection('mysql://root@localhost:3306/manuver');
    
    console.log('Clearing old data...');
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('TRUNCATE TABLE manuver');
    await conn.query('TRUNCATE TABLE penyulang');
    await conn.query('TRUNCATE TABLE gardu_induk');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Seeding...');
    for (const item of dataMaster) {
        const [res] = await conn.query('INSERT INTO gardu_induk (nama) VALUES (?)', [item.gi]);
        const giId = res.insertId;

        for (const p of item.penyulang) {
            await conn.query('INSERT INTO penyulang (nama, gardu_induk_id, ulp) VALUES (?, ?, ?)', [p, giId, item.ulp]);
        }
        console.log(`GI ${item.gi} with ${item.penyulang.length} penyulang inserted.`);
    }

    console.log('Done.');
    process.exit(0);
}
seed().catch(console.error);

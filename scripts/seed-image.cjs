const mysql = require('mysql2/promise');

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
    { gi: 'BANGKALAN', trf: '2', ulp: 'BANGKALAN', penyulang: 'ALANG - ALANG' },
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
    { gi: 'PAMEKASAN', trf: '1', ulp: 'PAMEKASAN', penyulang: 'PROPO' },
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
    { gi: 'PAMEKASAN', trf: '2', ulp: 'PAMEKASAN- SAMPANG-WARU', penyulang: 'BATU AMPAR' },
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

async function seed() {
    const conn = await mysql.createConnection('mysql://root@localhost:3306/manuver');
    
    console.log('Clearing old data...');
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('TRUNCATE TABLE manuver');
    await conn.query('TRUNCATE TABLE penyulang');
    await conn.query('TRUNCATE TABLE gardu_induk');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Seeding...');
    let giMap = {};

    for (const item of dataRaw) {
        if (!giMap[item.gi]) {
            const [res] = await conn.query('INSERT INTO gardu_induk (nama) VALUES (?)', [item.gi]);
            giMap[item.gi] = res.insertId;
        }

        const giId = giMap[item.gi];
        await conn.query('INSERT INTO penyulang (nama, gardu_induk_id, trf, ulp) VALUES (?, ?, ?, ?)', [item.penyulang, giId, item.trf, item.ulp.trim()]);
    }

    console.log('Seeding Done. Migrated exact Image Data.');
    process.exit(0);
}
seed().catch(console.error);

const mysql = require('mysql2/promise');

async function run() {
    const connection = await mysql.createConnection("mysql://root@localhost:3306/manuver");
    try {
        const [rows] = await connection.execute("SELECT id, nama, beban_siang, beban_malam FROM penyulang");
        console.log('Penyulang List:');
        rows.forEach(r => console.log(`${r.id}: ${r.nama} (S:${r.beban_siang}, M:${r.beban_malam})`));
    } catch (e) {
        console.error('Error:', e.message);
    }
    await connection.end();
}

run();

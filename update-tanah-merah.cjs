const mysql = require('mysql2/promise');

async function run() {
    const connection = await mysql.createConnection("mysql://root@localhost:3306/manuver");
    try {
        console.log('Updating Tanah Merah...');
        const [result] = await connection.execute("UPDATE penyulang SET beban_malam = 60 WHERE id = 11");
        console.log('Update Result:', result);
        
        const [rows] = await connection.execute("SELECT id, nama, beban_siang, beban_malam FROM penyulang WHERE id = 11");
        console.log('Verification:', rows[0]);
    } catch (e) {
        console.error('Error:', e.message);
    }
    await connection.end();
}

run();

require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    console.log('Connected to database.');
    await connection.execute('UPDATE penyulang SET beban_sekarang = 0');
    console.log('Reset all beban_sekarang to 0.');
    await connection.end();
}

main().catch(console.error);

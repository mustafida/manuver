const mysql = require('mysql2/promise');

async function run() {
    const connection = await mysql.createConnection("mysql://root@localhost:3306/manuver");
    try {
        console.log('Running migration...');
        await connection.execute("ALTER TABLE penyulang ADD COLUMN beban_siang FLOAT DEFAULT 0");
        await connection.execute("ALTER TABLE penyulang ADD COLUMN beban_malam FLOAT DEFAULT 0");
        await connection.execute("UPDATE penyulang SET beban_siang = beban_asli, beban_malam = beban_asli, beban_sekarang = beban_asli");
        console.log('Migration successful!');
    } catch (e) {
        if (e.message.includes('Duplicate column name')) {
            console.log('Columns already exist.');
        } else {
            console.error('Migration failed:', e.message);
        }
    }
    await connection.end();
}

run();

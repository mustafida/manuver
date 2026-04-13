const mysql = require('mysql2/promise');

async function run() {
    const connection = await mysql.createConnection("mysql://root@localhost:3306/manuver");
    try {
        console.log('Running migration: Adding Normalization Columns...');
        
        // Add columns if they don't exist
        await connection.execute("ALTER TABLE manuver ADD COLUMN section_asal_penormalan VARCHAR(255) NULL");
        await connection.execute("ALTER TABLE manuver ADD COLUMN section_tujuan_penormalan VARCHAR(255) NULL");
        await connection.execute("ALTER TABLE manuver ADD COLUMN pelaksanaan_asal_penormalan VARCHAR(255) NULL");
        await connection.execute("ALTER TABLE manuver ADD COLUMN pelaksanaan_tujuan_penormalan VARCHAR(255) NULL");
        
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

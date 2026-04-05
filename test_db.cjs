const { drizzle } = require('drizzle-orm/mysql2');
const mysql = require('mysql2/promise');
const { mysqlTable, int, datetime, mysqlEnum, text, float } = require('drizzle-orm/mysql-core');
const { eq } = require('drizzle-orm');

const manuver = mysqlTable('manuver', {
    id: int('id').autoincrement().primaryKey(),
    status: mysqlEnum('status', ['AKTIF', 'NORMAL']).notNull().default('AKTIF'),
    waktuManuver: datetime('waktu_manuver').notNull(),
});

async function run() {
    const client = await mysql.createConnection('mysql://root@localhost:3306/manuver');
    const db = drizzle(client);
    
    try {
        console.log('Testing simple select...');
        const result = await db.select().from(manuver).where(eq(manuver.status, 'AKTIF'));
        console.log('Result:', result);
    } catch (e) {
        console.error('FAILED QUERY:', e);
    } finally {
        await client.end();
    }
}
run();

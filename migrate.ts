import { db } from './src/lib/server/db/index';
import { sql } from 'drizzle-orm';

async function run() {
    try {
        console.log('Running migration...');
        await db.execute(sql`ALTER TABLE penyulang ADD COLUMN beban_siang FLOAT DEFAULT 0`);
        await db.execute(sql`ALTER TABLE penyulang ADD COLUMN beban_malam FLOAT DEFAULT 0`);
        await db.execute(sql`UPDATE penyulang SET beban_siang = beban_asli, beban_malam = beban_asli`);
        console.log('Migration successful!');
    } catch (e: any) {
        console.error('Migration failed:', e.message);
    }
    process.exit(0);
}

run();

import { db } from '../src/lib/server/db/index';
import { sql } from 'drizzle-orm';

async function fix() {
    await db.execute(sql`UPDATE penyulang SET beban_sekarang = 0`);
    console.log('Fixed beban_sekarang to 0');
    process.exit(0);
}
fix();

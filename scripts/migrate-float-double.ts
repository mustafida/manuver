import { db } from '../src/lib/server/db';
import { sql } from 'drizzle-orm';

async function migrateFloatToDouble() {
    try {
        console.log("Starting float to double migration...");
        
        await db.execute(sql`ALTER TABLE penyulang MODIFY COLUMN beban_siang DOUBLE DEFAULT 0`);
        await db.execute(sql`ALTER TABLE penyulang MODIFY COLUMN beban_malam DOUBLE DEFAULT 0`);
        await db.execute(sql`ALTER TABLE penyulang MODIFY COLUMN beban_sekarang DOUBLE DEFAULT 0`);
        
        await db.execute(sql`ALTER TABLE manuver MODIFY COLUMN beban_ampere_manuver DOUBLE NOT NULL`);
        await db.execute(sql`ALTER TABLE manuver MODIFY COLUMN beban_sebelum DOUBLE NOT NULL`);
        
        console.log("Migration complete!");
    } catch (e) {
        console.error("Migration failed:", e);
    }
    process.exit(0);
}

migrateFloatToDouble();

import { db } from '../src/lib/server/db';
import { penyulang } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

async function updatePragaan() {
    try {
        console.log("Starting update...");

        // PRAGAAN (180) -> SUMENEP-PAMEKASAN
        await db.update(penyulang).set({ ulp: 'SUMENEP-PAMEKASAN' }).where(eq(penyulang.id, 180));
        console.log("✅ PRAGAAN updated");

        console.log("Updates completed successfully.");
    } catch (error) {
        console.error("Error updating penyulang:", error);
    }
    process.exit(0);
}

updatePragaan();

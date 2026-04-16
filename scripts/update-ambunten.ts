import { db } from '../src/lib/server/db';
import { penyulang } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

async function updateAmbunten() {
    try {
        console.log("Starting update...");

        // RUBARU (166) -> SUMENEP-AMBUNTEN
        await db.update(penyulang).set({ ulp: 'SUMENEP-AMBUNTEN' }).where(eq(penyulang.id, 166));
        console.log("✅ RUBARU updated");

        // PRANCAK (178) -> WARU-AMBUNTEN
        await db.update(penyulang).set({ ulp: 'WARU-AMBUNTEN' }).where(eq(penyulang.id, 178));
        console.log("✅ PRANCAK updated");

        console.log("Updates completed successfully.");
    } catch (error) {
        console.error("Error updating penyulang:", error);
    }
    process.exit(0);
}

updateAmbunten();

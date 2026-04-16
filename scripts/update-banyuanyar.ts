import { db } from '../src/lib/server/db';
import { penyulang } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

async function updateBanyuAnyar() {
    try {
        console.log("Starting update...");

        // BANYU ANYAR (155) -> PAMEKASAN-WARU
        await db.update(penyulang).set({ ulp: 'PAMEKASAN-WARU' }).where(eq(penyulang.id, 155));
        console.log("✅ BANYU ANYAR updated");

        console.log("Updates completed successfully.");
    } catch (error) {
        console.error("Error updating penyulang:", error);
    }
    process.exit(0);
}

updateBanyuAnyar();

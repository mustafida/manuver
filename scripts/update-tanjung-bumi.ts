import { db } from '../src/lib/server/db';
import { penyulang } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

async function updateTanjungBumi() {
    try {
        console.log("Starting update...");

        // 1. TANJUNG BUMI (130) -> BANGKALAN
        await db.update(penyulang).set({ ulp: 'BANGKALAN' }).where(eq(penyulang.id, 130));
        console.log("✅ TANJUNG BUMI updated to BANGKALAN");

        console.log("Updates completed successfully.");
    } catch (error) {
        console.error("Error updating penyulang:", error);
    }
    process.exit(0);
}

updateTanjungBumi();

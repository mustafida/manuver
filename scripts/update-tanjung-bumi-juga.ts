import { db } from '../src/lib/server/db';
import { penyulang } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

async function updateTanjungBumi() {
    try {
        console.log("Starting update...");

        // TANJUNG BUMI (130) -> BANGKALAN-KETAPANG
        await db.update(penyulang).set({ ulp: 'BANGKALAN-KETAPANG' }).where(eq(penyulang.id, 130));
        console.log("✅ TANJUNG BUMI updated");

        console.log("Updates completed successfully.");
    } catch (error) {
        console.error("Error updating penyulang:", error);
    }
    process.exit(0);
}

updateTanjungBumi();

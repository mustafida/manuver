import { db } from '../src/lib/server/db';
import { penyulang } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

async function updatePenyulang() {
    try {
        console.log("Starting bulk update...");

        // 1. TANJUNG BUMI (130) -> KETAPANG
        await db.update(penyulang).set({ ulp: 'KETAPANG' }).where(eq(penyulang.id, 130));
        console.log("✅ TANJUNG BUMI updated to KETAPANG");

        // 2. PARSEH (133) -> BANGKALAN
        await db.update(penyulang).set({ ulp: 'BANGKALAN' }).where(eq(penyulang.id, 133));
        console.log("✅ PARSEH updated to BANGKALAN");

        // 3. BATU AMPAR (162) -> PAMEKASAN
        await db.update(penyulang).set({ ulp: 'PAMEKASAN' }).where(eq(penyulang.id, 162));
        console.log("✅ BATU AMPAR updated to PAMEKASAN");

        // 4. PRAGAAN (180) -> PAMEKASAN
        await db.update(penyulang).set({ ulp: 'PAMEKASAN' }).where(eq(penyulang.id, 180));
        console.log("✅ PRAGAAN updated to PAMEKASAN");

        // 5. BANYU ANYAR (155) -> WARU
        await db.update(penyulang).set({ ulp: 'WARU' }).where(eq(penyulang.id, 155));
        console.log("✅ BANYU ANYAR updated to WARU");

        // 6. PRANCAK (178) -> WARU
        await db.update(penyulang).set({ ulp: 'WARU' }).where(eq(penyulang.id, 178));
        console.log("✅ PRANCAK updated to WARU");

        // 7. RUBARU (166) -> SUMENEP (Setting strictly to one ULP: SUMENEP)
        await db.update(penyulang).set({ ulp: 'SUMENEP' }).where(eq(penyulang.id, 166));
        console.log("✅ RUBARU updated to SUMENEP");

        console.log("All updates completed successfully.");
    } catch (error) {
        console.error("Error updating penyulang:", error);
    }
    process.exit(0);
}

updatePenyulang();

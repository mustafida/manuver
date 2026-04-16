import { db } from '../src/lib/server/db';
import { penyulang } from '../src/lib/server/db/schema';
import { eq, or } from 'drizzle-orm';

async function updateBanyuates() {
    try {
        console.log("Starting update...");
        await db.update(penyulang)
            .set({ ulp: 'Ketapang' })
            .where(or(
                eq(penyulang.nama, 'BANYUATES'),
                eq(penyulang.nama, 'Banyuates'),
                eq(penyulang.nama, 'banyuates')
            ));
        console.log("✅ Successfully updated Penyulang Banyuates ULP to Ketapang.");
    } catch (e) {
        console.error("Error updating: ", e);
    }
    process.exit(0);
}

updateBanyuates();

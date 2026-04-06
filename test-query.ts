import { db } from './src/lib/server/db/index.js';
import { penyulang } from './src/lib/server/db/schema.js';

async function logPenyulang() {
    try {
        const p = await db.select().from(penyulang).limit(5);
        console.log("Penyulang fetched:", p);
    } catch(e) {
        console.error(e);
    }
    process.exit(0);
}
logPenyulang();

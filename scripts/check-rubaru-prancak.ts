import { db } from '../src/lib/server/db';
import { penyulang } from '../src/lib/server/db/schema';
import { eq, or } from 'drizzle-orm';

async function checkPenyulang() {
    const list = await db.select().from(penyulang).where(
        or(
            eq(penyulang.id, 166), // RUBARU
            eq(penyulang.id, 178)  // PRANCAK
        )
    );
    console.log(list);
    process.exit(0);
}

checkPenyulang();

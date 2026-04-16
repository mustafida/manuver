import { db } from '../src/lib/server/db';
import { penyulang } from '../src/lib/server/db/schema';
import { like } from 'drizzle-orm';

async function checkPenyulang() {
    const list = await db.select().from(penyulang).where(
        like(penyulang.nama, '%TANJUNG BUMI%')
    );
    console.log(list);
    process.exit(0);
}

checkPenyulang();

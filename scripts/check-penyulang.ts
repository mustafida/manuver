import { db } from '../src/lib/server/db';
import { penyulang } from '../src/lib/server/db/schema';
import { like, or } from 'drizzle-orm';

async function checkPenyulang() {
    const list = await db.select().from(penyulang).where(
        or(
            like(penyulang.nama, '%TANJUNG BUMI%'),
            like(penyulang.nama, '%PARSEH%'),
            like(penyulang.nama, '%BATU AMPAR%'),
            like(penyulang.nama, '%PRAGAAN%'),
            like(penyulang.nama, '%BANYUANYAR%'),
            like(penyulang.nama, '%PRANCAK%'),
            like(penyulang.nama, '%RUBARU%')
        )
    );
    console.log(list);
    process.exit(0);
}

checkPenyulang();

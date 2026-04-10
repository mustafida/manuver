import { db } from './src/lib/server/db/index.js';
import { penyulang } from './src/lib/server/db/schema.js';

async function test() {
    try {
        const result = await db.select().from(penyulang).limit(1);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (e) {
        console.error('Error:', e);
    }
    process.exit(0);
}

test();

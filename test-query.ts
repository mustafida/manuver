import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './src/lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import 'dotenv/config';

async function test() {
    const client = mysql.createPool(process.env.DATABASE_URL!);
    const db = drizzle(client, { schema, mode: 'default' });
    
    try {
        const activeManuvers = await db.query.manuver.findMany({
            where: eq(schema.manuver.status, 'AKTIF'),
            with: {
                penyulangAsal: true,
                penyulangTujuan: true
            },
            orderBy: [desc(schema.manuver.waktuManuver)]
        });
        console.log('Query success:', activeManuvers.length);
    } catch (e) {
        console.error('Query failed:', e);
    } finally {
        client.end();
    }
}
test();

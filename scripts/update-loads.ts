import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from '../src/lib/server/db/schema';
import { sql } from 'drizzle-orm';

const loadData = [
    { name: "MADURATEK", siang: 75, malam: 109 },
    { name: "UNIBANG", siang: 39, malam: 51 },
    { name: "KAMAL", siang: 80, malam: 100 },
    { name: "SEKARBUNGU", siang: 42, malam: 57 },
    { name: "MARTADINATA", siang: 68, malam: 80 },
    { name: "AROSBAYA", siang: 158, malam: 209 },
    { name: "SURAMADU", siang: 131, malam: 157 },
    { name: "LABANG", siang: 155, malam: 200 },
    { name: "TRAGEH", siang: 130, malam: 188 },
    { name: "TANJUNG BUMI", siang: 104, malam: 138 },
    { name: "TANAH MERAH", siang: 99, malam: 141 },
    { name: "ALAS KEMBANG", siang: 85, malam: 134 },
    { name: "PARSEH", siang: 118, malam: 162 },
    { name: "GEGER", siang: 77, malam: 114 },
    { name: "GALIS", siang: 77, malam: 193 },
    { name: "PEMUDA KAFFA", siang: 111, malam: 137 },
    { name: "ALANG-ALANG", siang: 51, malam: 74 },
    { name: "MERANDUNG", siang: 106, malam: 132 },
    { name: "WIJAYA KUSUMA", siang: 96, malam: 118 },
    { name: "OMBEN", siang: 99, malam: 144 },
    { name: "KEDUNDUNG", siang: 92, malam: 143 },
    { name: "AENG SAREH", siang: 145, malam: 189 },
    { name: "BANYUATES", siang: 135, malam: 221 },
    { name: "KEMUNING", siang: 111, malam: 172 },
    { name: "BANYUMAS", siang: 143, malam: 221 },
    { name: "BLEGA", siang: 163, malam: 233 },
    { name: "BIREM", siang: 176, malam: 238 },
    { name: "KETAPANG", siang: 165, malam: 263 },
    { name: "PAYUDAN", siang: 155, malam: 187 },
    { name: "TORJUN", siang: 147, malam: 218 },
    { name: "PROPO", siang: 75, malam: 111 },
    { name: "GAZALI", siang: 189, malam: 234 },
    { name: "CANDI BURUNG", siang: 93, malam: 122 },
    { name: "SUMEDANGAN", siang: 157, malam: 196 },
    { name: "BANYU ANYAR", siang: 134, malam: 168 },
    { name: "APUNG", siang: 150, malam: 171 },
    { name: "BLUMBUNGAN", siang: 192, malam: 213 },
    { name: "PEGANTENAN", siang: 157, malam: 232 },
    { name: "PAKONG", siang: 141, malam: 245 },
    { name: "PALENGAAN", siang: 130, malam: 212 },
    { name: "AREK LANCOR", siang: 187, malam: 210 },
    { name: "BATU AMPAR", siang: 100, malam: 161 },
    { name: "PAHLAWAN", siang: 63, malam: 90 },
    { name: "SARONGGI", siang: 102, malam: 150 },
    { name: "KALIANGET", siang: 106, malam: 134 },
    { name: "RUBARU", siang: 99, malam: 128 },
    { name: "WIRARAJA", siang: 63, malam: 70 },
    { name: "BLUTO", siang: 72, malam: 111 },
    { name: "BATANG BATANG", siang: 115, malam: 155 },
    { name: "SUMEKAR", siang: 138, malam: 163 },
    { name: "BATUPUTIH", siang: 140, malam: 170 },
    { name: "DUNGKEK", siang: 140, malam: 186 },
    { name: "AMBUNTEN", siang: 67, malam: 99 },
    { name: "LENTENG", siang: 82, malam: 119 },
    { name: "SULTAN", siang: 90, malam: 98 },
    { name: "TALANGO", siang: 92, malam: 144 },
    { name: "BANDUNGAN", siang: 162, malam: 242 },
    { name: "PRANCAK", siang: 143, malam: 226 },
    { name: "GANDING", siang: 110, malam: 152 },
    { name: "PRAGAAN", siang: 157, malam: 193 }
];

async function main() {
    const DATABASE_URL = "mysql://root@localhost:3306/manuver";
    const client = mysql.createPool(DATABASE_URL);
    const db = drizzle(client, { schema, mode: 'default' });

    console.log('Updating penyulang loads from image data...');

    for (const item of loadData) {
        await db.update(schema.penyulang)
            .set({ 
                bebanSiang: item.siang, 
                bebanMalam: item.malam 
            })
            .where(sql`nama = ${item.name}`);
    }

    // Set initial bebanSekarang based on current time
    const hour = new Date().getHours();
    const isSiang = hour >= 7 && hour < 16;
    
    await db.execute(sql`
        UPDATE penyulang 
        SET beban_sekarang = CASE 
            WHEN ${isSiang} THEN beban_siang 
            ELSE beban_malam 
        END
    `);

    console.log('==== Loads Update Finished ====');
    client.end();
    process.exit(0);
}

main().catch((err) => {
	console.error('Update error:', err);
	process.exit(1);
});

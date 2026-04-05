const { drizzle } = require('drizzle-orm/mysql2');
const mysql = require('mysql2/promise');
const { eq, desc } = require('drizzle-orm');

async function test() {
    process.env.DATABASE_URL = "mysql://root@localhost:3306/manuver";
    const client = mysql.createPool(process.env.DATABASE_URL);
    
    // Hardcode parts of schema since requireing typescript schema isn't trivial without tsx/vite-node
    // But wait! SvelteKit's vite dev logs actually print out the exact error.
    
    try {
        const [rows] = await client.query('SELECT `id`, `penyulang_asal_id`, `penyulang_tujuan_id`, `waktu_manuver`, `waktu_penormalan`, `beban_ampere_manuver`, `beban_sebelum`, `beban_sesudah`, `keterangan`, `status` FROM `manuver` WHERE `status` = ? ORDER BY `waktu_manuver` DESC', ['AKTIF']);
        
        console.log('Query success:', rows.length);
    } catch (e) {
        console.error('Query failed:', e);
    } finally {
        client.end();
    }
}
test();

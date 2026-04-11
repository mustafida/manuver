import { db } from './index';
import { garduInduk, penyulang, manuver } from './schema';

async function seed() {
    console.log('Seeding data...');
    
    // Seed Gardu Induk
    const [giResult] = await db.insert(garduInduk).values({
        nama: 'GI Bangkalan'
    });
    
    const giId = giResult.insertId;
    
    // Seed Penyulang
    const [penAsalResult] = await db.insert(penyulang).values({
        nama: 'Bangkalan 1',
        garduIndukId: giId,
        trf: 'Trafo 1',
        bebanSiang: 150.5,
        ulp: 'Bangkalan'
    });
    
    const [penTujuanResult] = await db.insert(penyulang).values({
        nama: 'Kamal 1',
        garduIndukId: giId,
        trf: 'Trafo 2',
        bebanSiang: 120.0,
        ulp: 'Kamal'
    });
    
    // Seed Manuver
    await db.insert(manuver).values({
        penyulangAsalId: penAsalResult.insertId,
        penyulangTujuanId: penTujuanResult.insertId,
        waktuManuver: new Date(),
        bebanAmpereManuver: 50.5,
        bebanSebelum: 150.5,
        status: 'AKTIF'
    });
    
    console.log('Seed completed successfully!');
}

seed().catch(console.error).finally(() => process.exit(0));

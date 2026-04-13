import { db } from '$lib/server/db';
import { garduInduk, penyulang } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const listGarduInduk = await db.select().from(garduInduk).orderBy(garduInduk.nama);
    const listPenyulang = await db.query.penyulang.findMany({
        with: {
            garduInduk: true
        },
        orderBy: [desc(penyulang.id)]
    });

    return { listGarduInduk, listPenyulang: listPenyulang as any };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const nama = formData.get('nama')?.toString()?.trim();
        const garduIndukId = Number(formData.get('garduIndukId'));
        const trf = formData.get('trf')?.toString()?.trim();
        const ulp = formData.get('ulp')?.toString()?.trim();
        const bebanSiang = Number(formData.get('bebanSiang'));
        const bebanMalam = Number(formData.get('bebanMalam'));

        if (!nama) return fail(400, { message: 'Nama Penyulang wajib diisi.' });
        if (!garduIndukId) return fail(400, { message: 'Gardu Induk wajib dipilih.' });
        if (!ulp) return fail(400, { message: 'ULP wajib dipilih.' });
        if (isNaN(bebanSiang) || bebanSiang <= 0) return fail(400, { message: 'Beban Siang harus angka > 0.' });
        if (isNaN(bebanMalam) || bebanMalam <= 0) return fail(400, { message: 'Beban Malam harus angka > 0.' });

        try {
            // Determine initial bebanSekarang based on current time (Siang: 07:00 - 16:00)
            const hour = new Date().getHours();
            const initialBeban = (hour >= 7 && hour < 16) ? bebanSiang : bebanMalam;

            await db.insert(penyulang).values({
                nama,
                garduIndukId,
                trf,
                ulp,
                bebanSiang,
                bebanMalam,
                bebanSekarang: initialBeban
            });
            return { success: true };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Gagal menambah data' });
        }
    },
    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'ID tidak valid' });

        try {
            await db.delete(penyulang).where(eq(penyulang.id, id));
            return { success: true };
        } catch (e) {
            return fail(500, { message: 'Gagal menghapus' });
        }
    }
};

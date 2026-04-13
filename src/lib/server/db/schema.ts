import { mysqlTable, int, varchar, datetime, text, float, mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const garduInduk = mysqlTable('gardu_induk', {
	id: int('id').autoincrement().primaryKey(),
	nama: varchar('nama', { length: 255 }).notNull(),
});

export const penyulang = mysqlTable('penyulang', {
	id: int('id').autoincrement().primaryKey(),
	nama: varchar('nama', { length: 255 }).notNull(),
	garduIndukId: int('gardu_induk_id').notNull(),
	trf: varchar('trf', { length: 100 }),
	ulp: varchar('ulp', { length: 255 }).notNull(),
	bebanSiang: float('beban_siang').default(0),
	bebanMalam: float('beban_malam').default(0),
	bebanSekarang: float('beban_sekarang').default(0),
});

export const manuver = mysqlTable('manuver', {
	id: int('id').autoincrement().primaryKey(),
	penyulangAsalId: int('penyulang_asal_id').notNull(),
	penyulangTujuanId: int('penyulang_tujuan_id').notNull(),
	sectionAsal: varchar('section_asal', { length: 255 }),
	sectionTujuan: varchar('section_tujuan', { length: 255 }),
	waktuManuver: datetime('waktu_manuver').notNull(),
	waktuPenormalan: datetime('waktu_penormalan'),
	bebanAmpereManuver: float('beban_ampere_manuver').notNull(),
	bebanSebelum: float('beban_sebelum').notNull(),
	bebanSesudah: float('beban_sesudah'),
	pelaksanaanAsal: varchar('pelaksanaan_asal', { length: 255 }),
	pelaksanaanTujuan: varchar('pelaksanaan_tujuan', { length: 255 }),
	keterangan: text('keterangan'),
	durasi: int('durasi'),
	status: mysqlEnum('status', ['AKTIF', 'NORMAL']).notNull().default('AKTIF'),
});

export const garduIndukRelations = relations(garduInduk, ({ many }) => ({
	penyulang: many(penyulang),
}));

export const penyulangRelations = relations(penyulang, ({ one, many }) => ({
	garduInduk: one(garduInduk, {
		fields: [penyulang.garduIndukId],
		references: [garduInduk.id]
	}),
	manuverAsal: many(manuver, { relationName: 'manuverAsal' }),
	manuverTujuan: many(manuver, { relationName: 'manuverTujuan' })
}));

export const manuverRelations = relations(manuver, ({ one }) => ({
	penyulangAsal: one(penyulang, {
		fields: [manuver.penyulangAsalId],
		references: [penyulang.id],
		relationName: 'manuverAsal'
	}),
	penyulangTujuan: one(penyulang, {
		fields: [manuver.penyulangTujuanId],
		references: [penyulang.id],
		relationName: 'manuverTujuan'
	})
}));

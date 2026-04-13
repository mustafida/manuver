import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, varchar, datetime, float, text, mysqlEnum } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const garduInduk = mysqlTable("gardu_induk", {
	id: int().autoincrement().notNull(),
	nama: varchar({ length: 255 }).notNull(),
});

export const manuver = mysqlTable("manuver", {
	id: int().autoincrement().notNull(),
	penyulangAsalId: int("penyulang_asal_id").notNull(),
	penyulangTujuanId: int("penyulang_tujuan_id").notNull(),
	waktuManuver: datetime("waktu_manuver", { mode: 'string'}).notNull(),
	waktuPenormalan: datetime("waktu_penormalan", { mode: 'string'}).default('NULL'),
	bebanAmpereManuver: float("beban_ampere_manuver").notNull(),
	bebanSebelum: float("beban_sebelum").notNull(),
	bebanSesudah: float("beban_sesudah").default('NULL'),
	keterangan: text().default('NULL'),
	status: mysqlEnum(['AKTIF','NORMAL']).default('\'AKTIF\'').notNull(),
	pelaksanaan: varchar({ length: 255 }).default('NULL'),
	sectionAsal: varchar("section_asal", { length: 255 }).default('NULL'),
	sectionTujuan: varchar("section_tujuan", { length: 255 }).default('NULL'),
	durasi: int().default('NULL'),
});

export const penyulang = mysqlTable("penyulang", {
	id: int().autoincrement().notNull(),
	nama: varchar({ length: 255 }).notNull(),
	garduIndukId: int("gardu_induk_id").notNull(),
	trf: varchar({ length: 100 }).default('NULL'),
	ulp: varchar({ length: 255 }).notNull(),
	bebanSekarang: float("beban_sekarang"),
	bebanSiang: float("beban_siang"),
	bebanMalam: float("beban_malam"),
});

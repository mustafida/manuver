CREATE TABLE `gardu_induk` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	CONSTRAINT `gardu_induk_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `manuver` (
	`id` int AUTO_INCREMENT NOT NULL,
	`penyulang_asal_id` int NOT NULL,
	`penyulang_tujuan_id` int NOT NULL,
	`waktu_manuver` datetime NOT NULL,
	`waktu_penormalan` datetime,
	`beban_ampere_manuver` float NOT NULL,
	`beban_sebelum` float NOT NULL,
	`beban_sesudah` float,
	`keterangan` text,
	`status` enum('AKTIF','NORMAL') NOT NULL DEFAULT 'AKTIF',
	CONSTRAINT `manuver_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `penyulang` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	`gardu_induk_id` int NOT NULL,
	`trf` varchar(100),
	`input_arus_siang` float,
	`ulp` enum('Bangkalan','Kamal','Blega','Sampang','Pamekasan','Sumenep','Ketapang','Waru','Ambunten') NOT NULL,
	CONSTRAINT `penyulang_id` PRIMARY KEY(`id`)
);

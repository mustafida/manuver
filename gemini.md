```
# Aplikasi manuver beban

- Data Master Gardu Induk
  - Nama Gardu Induk
- Data Master Penyulang Aktif
  - Nama Punyulang
  - Gardu Induk
  - TRF
  - Input Arus (Siang)
  - ULP (Unit Layanan Pelanggan): Bangkalan, Kamal, Blega, Sampang, Pamekasan, Sumenep, Ketapang, Waru, Ambunten
- Input manuver
  - Penyulang yang terlibat
  - Tanggal dan Waktu (Waktu Manuver dan Waktu Penormalan)
  - Beban ampere
  - Keterangan
- Monitoring terjadi manuver
  - Nama penyulang (misal a ke b)
  - Beban ampere di manuver
  - Beban sebelum dan sesudah manuver
- Dashboard
  - Melihat manuver
  - Notifikasi manuver aktif (status)

## catatan
- 1 Gardu Induk memiliki beberapa penyulang

Buatkan web application dashboard bernama:

"Monitoring Manuver Penyulang"

Tema: Dashboard monitoring jaringan listrik bergaya profesional seperti sistem PLN.


## KONSEP DESAIN (WAJIB DIIKUTI)

Gunakan desain:
- Clean modern dashboard
- Dominasi warna biru (PLN style)
- Gradient biru pada sidebar
- Card berwarna (biru, merah, hijau) untuk statistik
- Layout kiri sidebar, kanan konten utama


## LAYOUT UTAMA

1. SIDEBAR (KIRI)
- Background: gradient biru (dark ke light)
- Logo di atas (PLN + icon petir)
- Menu:
  - Dashboard
  - Data Manuver (aktif)
  - Input Data
  - Logout
- Menu aktif diberi highlight (background putih + rounded)

2. TOPBAR (ATAS)
- Judul: "Monitoring Manuver Penyulang"
- Kanan:
  - Tombol Logout
  - Icon user (bulat)


##HALAMAN DATA MANUVER (SESUAI GAMBAR)

A. CARD STATISTIK (3 CARD HORIZONTAL)
- Card 1:
  - Judul: Total Penyulang
  - Warna: Biru
  - Value: angka besar (0)
- Card 2:
  - Judul: Sedang Manuver
  - Warna: Merah
  - Value: angka besar
- Card 3:
  - Judul: Sudah Normal
  - Warna: Hijau
  - Value: angka besar

Style:
- Rounded
- Shadow halus
- Teks putih
- Ukuran besar dan bold


B. FILTER DAN AKSI
- Kiri:
  - Dropdown filter:
    - All
    - Normal
    - Sedang Manuver
- Kanan:
  - Search input:
    - Placeholder: "Cari Penyulang..."
  - Tombol:
    - "Tambah Data" (warna kuning)

C. TABEL DATA
Kolom:
- Penyulang
- ULP
- Status
- Beban (Ampere)

Isi:
- Jika kosong:
  - Tampilkan: "Tidak ada data penyulang."
- Footer:
  - Info jumlah data (Showing 0 to 0 of 0 entries)
  - Pagination (1,2,3,...)

Style:
- Header tabel biru
- Border halus
- Padding rapi
- Hover row effect

##HALAMAN INPUT DATA

Form input dengan layout card:

A. FIELD:
- Waktu (datetime picker)
- Beban (Ampere)
- Keterangan (textarea)
- Pilih penyulang:
  - Checkbox list
  - Ada search

B. VALIDASI:
- Semua field wajib
- Beban harus angka > 0
- Minimal pilih 2 penyulang

C. BUTTON:
- Simpan
- Batal

## DASHBOARD UTAMA

- Ringkasan:
  - Total Penyulang
  - Manuver Aktif
  - Gardu Induk
- Statistik:
  - Total beban aktif
  - Rata-rata beban
  - Durasi
- Progress bar:
  - Rasio penyelesaian
- Monitoring:
  - Jika tidak ada manuver:
    → tampilkan "Semua manuver sudah normal"

## LOGIC SISTEM

- Status:
  - "Sedang Manuver" → aktif
  - "Normal" → selesai
- Saat tambah data:
  - Status otomatis "Sedang Manuver"
- Saat selesai:
  - Status berubah "Normal"
- Statistik update otomatis

## STYLE DETAIL

- Font: modern sans-serif
- Border radius: medium
- Shadow: soft
- Warna:
  - Biru: primary
  - Merah: warning
  - Hijau: success
  - Kuning: action button
- Spacing: konsisten dan lega

## RESPONSIVE

- Sidebar bisa collapse di mobile
- Card stack vertikal di layar kecil
- Table scroll horizontal

## TEKNOLOGI

- Gunakan:
  - React / HTML + JS
- State management sederhana
- Gunakan dummy data / local storage

## HASIL AKHIR

- Tampilan sangat mirip dashboard PLN
- UI profesional dan rapi
- Semua fitur berjalan
- Interaktif dan user-friendly
```
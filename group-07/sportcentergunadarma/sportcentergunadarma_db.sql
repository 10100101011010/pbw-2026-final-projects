-- =====================================================
-- database: sportcenter_db
-- sistem penyewaan lapangan sport center kampus (gratis)
-- =====================================================
-- cara pakai:
-- 1. buka phpmyadmin, buat database baru namanya "sportcenter_db"
-- 2. klik tab "import", pilih file ini, lalu klik "go"
-- 3. tabel bakal otomatis keisi data master (lapangan + akun admin) doang --
--    tabel booking sengaja dikosongkan (di-flush), jadi kamu mulai dari
--    riwayat booking yang bersih, bukan data testing sebelumnya
-- =====================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- tabel akun pengguna (mahasiswa & admin/petugas)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  npm VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('mahasiswa','admin') DEFAULT 'mahasiswa',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- tabel data lapangan (ruang fisik) yang bisa disewa.
-- catatan: kolom "jenis" di sini nyimpen string gabungan kayak
-- "Voli/Basket/Futsal" -- ini KEPUTUSAN SEDERHANA yang dipertahankan sesuai
-- draft terbaru, meskipun secara akademis (normalisasi 1nf) idealnya olahraga
-- yang didukung tiap lapangan itu dipisah ke tabel relasi tersendiri (kolom
-- tidak boleh multi-value). kalau nanti mau dirapikan ke bentuk relasional,
-- itu perubahan struktur yang perlu dibahas terpisah, bukan otomatis di sini
CREATE TABLE IF NOT EXISTS lapangan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  jenis VARCHAR(50) NOT NULL,
  lokasi VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  gambar VARCHAR(255) DEFAULT NULL,
  status ENUM('aktif','nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- tabel booking/penyewaan.
-- kolom "catatan_pembatalan" BARU ditambahkan di sini -- wajib diisi admin
-- tiap kali membatalkan booking mahasiswa (lihat api/admin_batalkan_booking.php),
-- isinya ditampilkan balik ke mahasiswa di riwayat.php biar dia tau alasannya
CREATE TABLE IF NOT EXISTS booking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_booking VARCHAR(10) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  lapangan_id INT NOT NULL,
  tanggal DATE NOT NULL,
  jam_mulai TIME NOT NULL,
  jam_selesai TIME NOT NULL,
  no_hp VARCHAR(20) NOT NULL,
  status ENUM('pending','confirmed','cancelled','expired') DEFAULT 'pending',
  checked_in_at DATETIME DEFAULT NULL,
  checked_in_by INT DEFAULT NULL,
  dibatalkan_oleh_admin INT DEFAULT NULL,
  catatan_pembatalan TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lapangan_id) REFERENCES lapangan(id),
  FOREIGN KEY (checked_in_by) REFERENCES users(id),
  FOREIGN KEY (dibatalkan_oleh_admin) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- tabel booking SENGAJA tidak diisi data apapun di sini (kosong/flushed) --
-- ini tabel transaksi yang harus mulai dari nol tiap fresh install, beda
-- sama tabel lapangan/users di bawah yang memang data master/setup awal

-- akun admin/petugas default
-- npm: ADMIN001 | password: admin123 (sudah di-hash pakai bcrypt)
INSERT INTO users (id, npm, nama, email, password, role) VALUES
(1, 'ADMIN001', 'Admin Sport Center', 'admin@gunadarma.ac.id', '$2b$12$fZkrG9jy7IlFzlrolKzfcOKAykZditcQyVxqdYFaRQnpxPMzrZDVy', 'admin');
ALTER TABLE users AUTO_INCREMENT = 2;

-- 5 lapangan: 2 indoor khusus badminton, 3 semi-outdoor (a, b, c) beda fasilitas.
-- kolom gambar cuma nyimpen NAMA FILE, file aslinya ada di assets/img/lapangan/
INSERT INTO lapangan (id, nama, jenis, lokasi, deskripsi, gambar, status) VALUES
(1, 'Lapangan A', 'Voli/Basket/Futsal', 'Kampus H - Semi Outdoor Court', 'ada ring basket, tiang net voli, dan gawang futsal', 'voli image 1.png', 'aktif'),
(2, 'Lapangan B', 'Basket', 'Kampus H - Semi Outdoor Court', 'cuma ada ring basket, tidak ada tiang net dan gawang', 'basket image 1.png', 'aktif'),
(3, 'Lapangan C', 'Basket/Futsal', 'Kampus H - Semi Outdoor Court', 'ada ring basket dan gawang futsal, tidak ada tiang net voli', 'futsal image 1.png', 'aktif'),
(4, 'Lapangan Badminton 1', 'Badminton', 'Kampus H - Indoor Court', 'lapangan badminton indoor ber-AC', 'badminton image 1.png', 'aktif'),
(5, 'Lapangan Badminton 2', 'Badminton', 'Kampus H - Indoor Court', 'lapangan badminton indoor ber-AC', 'badminton image 2.png', 'aktif');
ALTER TABLE lapangan AUTO_INCREMENT = 6;

COMMIT;

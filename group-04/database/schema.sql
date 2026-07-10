-- =========================================================
-- SIKUT - Sistem Kumpul Tugas Mahasiswa & Dosen
-- =========================================================

CREATE DATABASE IF NOT EXISTS sikutfixed_db;
USE sikutfixed_db;

-- ================== TABEL DOSEN ==================
CREATE TABLE dosen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    nip VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    no_hp VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    foto_profil VARCHAR(255),
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ================== TABEL MAHASISWA ==================
CREATE TABLE mahasiswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    npm VARCHAR(30) NOT NULL UNIQUE,
    kelas VARCHAR(20),
    jurusan VARCHAR(100),
    semester INT,
    email VARCHAR(100),
    no_hp VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    foto_profil VARCHAR(255),
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ================== TABEL MATA KULIAH ==================
CREATE TABLE matakuliah (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_matkul VARCHAR(20) NOT NULL UNIQUE,
    nama_matkul VARCHAR(150) NOT NULL,
    sks INT DEFAULT 3,
    dosen_id INT,
    warna VARCHAR(20) DEFAULT '#7C3AED',
    FOREIGN KEY (dosen_id) REFERENCES dosen(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============ TABEL RELASI MAHASISWA - MATA KULIAH ============
-- (mata kuliah yang diambil mahasiswa, diisi saat pendaftaran akun)
CREATE TABLE mahasiswa_matkul (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mahasiswa_id INT NOT NULL,
    matkul_id INT NOT NULL,
    FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id) ON DELETE CASCADE,
    FOREIGN KEY (matkul_id) REFERENCES matakuliah(id) ON DELETE CASCADE,
    UNIQUE KEY unik_ambil (mahasiswa_id, matkul_id)
) ENGINE=InnoDB;

-- ================== TABEL MATERI ==================
CREATE TABLE materi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matkul_id INT NOT NULL,
    judul VARCHAR(150) NOT NULL,
    keterangan TEXT,
    nama_file VARCHAR(255),
    path_file VARCHAR(255),
    tanggal_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (matkul_id) REFERENCES matakuliah(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ================== TABEL TUGAS ==================
CREATE TABLE tugas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matkul_id INT NOT NULL,
    judul VARCHAR(150) NOT NULL,
    deskripsi TEXT,
    tenggat DATETIME NOT NULL,
    nama_file VARCHAR(255),
    path_file VARCHAR(255),
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (matkul_id) REFERENCES matakuliah(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ================== TABEL PENGUMPULAN TUGAS ==================
CREATE TABLE pengumpulan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tugas_id INT NOT NULL,
    mahasiswa_id INT NOT NULL,
    nama_file VARCHAR(255),
    path_file VARCHAR(255),
    catatan TEXT,
    tanggal_kumpul TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nilai INT DEFAULT NULL,
    FOREIGN KEY (tugas_id) REFERENCES tugas(id) ON DELETE CASCADE,
    FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id) ON DELETE CASCADE,
    UNIQUE KEY unik_submit (tugas_id, mahasiswa_id)
) ENGINE=InnoDB;

-- ========== TABEL CHECKLIST PRIBADI (TO DO LIST MAHASISWA) ==========
-- Catatan: fitur ini murni untuk penanda pribadi mahasiswa,
-- terpisah dari status pengumpulan tugas ke dosen.
CREATE TABLE checklist_tugas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tugas_id INT NOT NULL,
    mahasiswa_id INT NOT NULL,
    selesai TINYINT(1) DEFAULT 0,
    FOREIGN KEY (tugas_id) REFERENCES tugas(id) ON DELETE CASCADE,
    FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id) ON DELETE CASCADE,
    UNIQUE KEY unik_checklist (tugas_id, mahasiswa_id)
) ENGINE=InnoDB;

-- ================== TABEL NOTIFIKASI / PENGINGAT ==================
CREATE TABLE notifikasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mahasiswa_id INT NOT NULL,
    matkul_id INT,
    pesan VARCHAR(255) NOT NULL,
    sudah_dibaca TINYINT(1) DEFAULT 0,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ========== TABEL TO-DO LIST PRIBADI MAHASISWA ==========
-- Catatan pribadi mahasiswa sendiri (bukan tugas dari dosen),
-- misal pengingat ujian, tugas kelompok pribadi, dll.
CREATE TABLE todo_pribadi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mahasiswa_id INT NOT NULL,
    judul VARCHAR(150) NOT NULL,
    catatan TEXT,
    tanggal_reminder DATE,
    selesai TINYINT(1) DEFAULT 0,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- DATA CONTOH (SUPAYA BISA LANGSUNG DICOBA)
-- Password untuk semua akun contoh di bawah adalah: 123456
-- Hash di bawah = password_hash('123456', PASSWORD_DEFAULT)
-- =========================================================

INSERT INTO dosen (nama, nip, email, no_hp, password) VALUES
('Dr. Lulu Chaerani Munggaran, S.Kom., M.M.S.I', '198501012010011001', 'luluchaerani@gunadarma.ac.id', '081234567890', '$2y$10$ceczCVFjo7jwVXHOkw.6beabHnzBOrHOMxTIc0NARCga3wHkY0EeK'),
('Dr. Metty Mustikasari, S.Kom., Msc', '198703152012032002', 'mettykasari@kgunadarma.ac.id', '081298765432', '$2y$10$ceczCVFjo7jwVXHOkw.6beabHnzBOrHOMxTIc0NARCga3wHkY0EeK'),
('Dr. Rifiana Arief., S.Kom., MMSI.', '199803152012032315', 'rifianarief@kgunadarma.ac.id', '081398641274', '$2y$10$ceczCVFjo7jwVXHOkw.6beabHnzBOrHOMxTIc0NARCga3wHkY0EeK'),
('Dr. Setia Wirawan, S.Kom., MMSI', '192703422012032307', 'setiawirawan@kgunadarma.ac.id', '087598645632', '$2y$10$ceczCVFjo7jwVXHOkw.6beabHnzBOrHOMxTIc0NARCga3wHkY0EeK');

INSERT INTO matakuliah (kode_matkul, nama_matkul, sks, dosen_id, warna) VALUES
('WEB101', 'Pemrograman Berbasis Web', 2, 1, '#7C3AED'),
('BD102', 'Sistem Basis Data', 3, 2, '#9333EA'),
('PBO103', 'Pemrograman Berbasis Objek', 3, 3, '#A855F7'),
('RPL501', 'Rekayasa Perangkat Lunak', 3, 4, '#A855F7'),
('JAR502', 'Jaringan Komputer', 2, 2, '#6D28D9');

INSERT INTO mahasiswa (nama, npm, kelas, jurusan, semester, email, no_hp, password) VALUES
('Eunseok Raka Aditama', '21051001', '3IF37', 'Teknik Informatika', 5, 'eunseokganteng@gmail.com', '081211112222', '$2y$10$ceczCVFjo7jwVXHOkw.6beabHnzBOrHOMxTIc0NARCga3wHkY0EeK');

INSERT INTO mahasiswa_matkul (mahasiswa_id, matkul_id) VALUES
(1, 4), (1, 5);

INSERT INTO tugas (matkul_id, judul, deskripsi, tenggat) VALUES
(1, 'Tugas PHP - Form Login Sederhana', 'Implementasikan form login sederhana menggunakan PHP native dan validasi input', DATE_ADD(NOW(), INTERVAL 2 DAY)),
(2, 'Normalisasi Basis Data', 'Lakukan normalisasi 1NF sampai 3NF pada studi kasus yang diberikan di materi', DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO materi (matkul_id, judul, keterangan) VALUES
(1, 'Pengenalan HTML & CSS', 'Slide materi pertemuan 1 tentang struktur dasar HTML dan styling CSS'),
(1, 'Dasar PHP & Koneksi Database', 'Materi tentang sintaks dasar PHP, PDO, dan koneksi ke MySQL'),
(2, 'Konsep Normalisasi Basis Data', 'Penjelasan mengenai 1NF, 2NF, dan 3NF beserta contoh studi kasus');

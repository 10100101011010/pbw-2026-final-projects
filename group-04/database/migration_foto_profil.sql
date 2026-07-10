-- =========================================================
-- SIKUT - Migrasi: tambah kolom foto_profil
-- Jalankan ini SEKALI di database sikutdb yang sudah ada
-- (lewat phpMyAdmin > tab SQL, atau CLI mysql)
-- Kalau muncul error "Duplicate column name", berarti kolomnya
-- sudah ada dan migrasi ini boleh diabaikan.
-- =========================================================

ALTER TABLE mahasiswa ADD COLUMN foto_profil VARCHAR(255) AFTER password;
ALTER TABLE dosen ADD COLUMN foto_profil VARCHAR(255) AFTER password;

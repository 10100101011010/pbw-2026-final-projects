<?php
require_once __DIR__ . '/../../includes/functions.php';
requireMahasiswa();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$mahasiswaId = $_SESSION['mahasiswa_id'];
$tugasId = (int) ($_POST['tugas_id'] ?? 0);
$catatan = bersihkan($_POST['catatan'] ?? '');

if ($tugasId <= 0) {
    jsonResponse(['success' => false, 'message' => 'Tugas tidak valid']);
}

// Pastikan tugas ini ada pada mata kuliah yang diambil mahasiswa
$stmtCek = $pdo->prepare("
    SELECT t.id, t.tenggat FROM tugas t
    JOIN mahasiswa_matkul mm ON mm.matkul_id = t.matkul_id
    WHERE t.id = ? AND mm.mahasiswa_id = ?
");
$stmtCek->execute([$tugasId, $mahasiswaId]);
$dataTugas = $stmtCek->fetch();
if (!$dataTugas) {
    jsonResponse(['success' => false, 'message' => 'Kamu tidak terdaftar pada mata kuliah tugas ini'], 403);
}

// Tolak pengumpulan kalau sudah lewat tenggat waktu
if (strtotime($dataTugas['tenggat']) < time()) {
    jsonResponse(['success' => false, 'message' => 'Tugas ini sudah lewat tenggat waktu dan tidak bisa dikumpulkan lagi.'], 403);
}

if (empty($_FILES['file_jawaban']['name']) && $catatan === '') {
    jsonResponse(['success' => false, 'message' => 'Unggah file jawaban atau isi catatan terlebih dahulu']);
}

$namaFile = null;
$pathFile = null;

if (!empty($_FILES['file_jawaban']['name'])) {
    $file = $_FILES['file_jawaban'];

    if ($file['size'] > 5 * 1024 * 1024) {
        jsonResponse(['success' => false, 'message' => 'Ukuran file maksimal 5MB']);
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        jsonResponse(['success' => false, 'message' => 'Gagal mengunggah file']);
    }

    $ekstensi = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $namaAman = 'jawaban_' . $mahasiswaId . '_' . $tugasId . '_' . time() . '.' . $ekstensi;
    $tujuan = __DIR__ . '/../../uploads/pengumpulan/' . $namaAman;

    if (!move_uploaded_file($file['tmp_name'], $tujuan)) {
        jsonResponse(['success' => false, 'message' => 'Gagal menyimpan file ke server']);
    }

    $namaFile = $file['name'];
    $pathFile = 'uploads/pengumpulan/' . $namaAman;
}

// Cek apakah mahasiswa sudah pernah mengumpulkan tugas ini sebelumnya
$stmtAda = $pdo->prepare('SELECT id FROM pengumpulan WHERE tugas_id = ? AND mahasiswa_id = ?');
$stmtAda->execute([$tugasId, $mahasiswaId]);
$pengumpulanLama = $stmtAda->fetch();

if ($pengumpulanLama) {
    if ($namaFile === null) {
        // Tidak upload file baru, pertahankan file lama, hanya update catatan
        $update = $pdo->prepare('UPDATE pengumpulan SET catatan = ?, tanggal_kumpul = NOW(), nilai = NULL WHERE id = ?');
        $update->execute([$catatan, $pengumpulanLama['id']]);
    } else {
        $update = $pdo->prepare('UPDATE pengumpulan SET nama_file = ?, path_file = ?, catatan = ?, tanggal_kumpul = NOW(), nilai = NULL WHERE id = ?');
        $update->execute([$namaFile, $pathFile, $catatan, $pengumpulanLama['id']]);
    }
    jsonResponse(['success' => true, 'message' => 'Tugas berhasil dikumpulkan ulang']);
} else {
    $insert = $pdo->prepare('INSERT INTO pengumpulan (tugas_id, mahasiswa_id, nama_file, path_file, catatan) VALUES (?, ?, ?, ?, ?)');
    $insert->execute([$tugasId, $mahasiswaId, $namaFile, $pathFile, $catatan]);
    jsonResponse(['success' => true, 'message' => 'Tugas berhasil dikumpulkan']);
}
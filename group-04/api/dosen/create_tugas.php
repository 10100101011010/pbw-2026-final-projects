<?php
require_once __DIR__ . '/../../includes/functions.php';
requireDosen();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$dosenId = $_SESSION['dosen_id'];

$matkulId  = (int) ($_POST['matkul_id'] ?? 0);
$judul     = bersihkan($_POST['judul'] ?? '');
$deskripsi = bersihkan($_POST['deskripsi'] ?? '');
$tenggat   = $_POST['tenggat'] ?? '';

if ($judul === '' || $deskripsi === '' || $tenggat === '') {
    jsonResponse(['success' => false, 'message' => 'Semua kolom wajib diisi!']);
}

// Pastikan mata kuliah ini benar milik dosen yang login
$stmtCek = $pdo->prepare('SELECT id FROM matakuliah WHERE id = ? AND dosen_id = ?');
$stmtCek->execute([$matkulId, $dosenId]);
if (!$stmtCek->fetch()) {
    jsonResponse(['success' => false, 'message' => 'Anda tidak memiliki akses ke mata kuliah ini'], 403);
}

// Lampiran file bersifat opsional
$namaFile = null;
$pathFile = null;

if (!empty($_FILES['file_tugas']['name'])) {
    $file = $_FILES['file_tugas'];

    if ($file['size'] > 10 * 1024 * 1024) {
        jsonResponse(['success' => false, 'message' => 'Ukuran lampiran maksimal 10MB']);
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        jsonResponse(['success' => false, 'message' => 'Gagal mengunggah lampiran']);
    }

    $ekstensi = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $namaAman = 'tugas_' . $matkulId . '_' . time() . '.' . $ekstensi;
    $tujuan = __DIR__ . '/../../uploads/tugas/' . $namaAman;

    if (!move_uploaded_file($file['tmp_name'], $tujuan)) {
        jsonResponse(['success' => false, 'message' => 'Gagal menyimpan lampiran ke server']);
    }

    $namaFile = $file['name'];
    $pathFile = 'uploads/tugas/' . $namaAman;
}

$stmt = $pdo->prepare('INSERT INTO tugas (matkul_id, judul, deskripsi, tenggat, nama_file, path_file) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->execute([$matkulId, $judul, $deskripsi, str_replace('T', ' ', $tenggat), $namaFile, $pathFile]);

jsonResponse(['success' => true, 'message' => 'Tugas baru berhasil dibuat']);

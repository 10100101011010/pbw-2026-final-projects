<?php
require_once __DIR__ . '/../../includes/functions.php';
requireDosen();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$dosenId = $_SESSION['dosen_id'];

$matkulId   = (int) ($_POST['matkul_id'] ?? 0);
$judul      = bersihkan($_POST['judul'] ?? '');
$keterangan = bersihkan($_POST['keterangan'] ?? '');

if ($judul === '') {
    jsonResponse(['success' => false, 'message' => 'Judul materi wajib diisi!']);
}

$stmtCek = $pdo->prepare('SELECT id FROM matakuliah WHERE id = ? AND dosen_id = ?');
$stmtCek->execute([$matkulId, $dosenId]);
if (!$stmtCek->fetch()) {
    jsonResponse(['success' => false, 'message' => 'Anda tidak memiliki akses ke mata kuliah ini'], 403);
}

$namaFile = null;
$pathFile = null;

if (!empty($_FILES['file_materi']['name'])) {
    $file = $_FILES['file_materi'];

    if ($file['size'] > 10 * 1024 * 1024) {
        jsonResponse(['success' => false, 'message' => 'Ukuran file maksimal 10MB']);
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        jsonResponse(['success' => false, 'message' => 'Gagal mengunggah file']);
    }

    $ekstensi = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $namaAman = 'materi_' . $matkulId . '_' . time() . '.' . $ekstensi;
    $tujuan = __DIR__ . '/../../uploads/materi/' . $namaAman;

    if (!move_uploaded_file($file['tmp_name'], $tujuan)) {
        jsonResponse(['success' => false, 'message' => 'Gagal menyimpan file ke server']);
    }

    $namaFile = $file['name'];
    $pathFile = 'uploads/materi/' . $namaAman;
}

$stmt = $pdo->prepare('INSERT INTO materi (matkul_id, judul, keterangan, nama_file, path_file) VALUES (?, ?, ?, ?, ?)');
$stmt->execute([$matkulId, $judul, $keterangan, $namaFile, $pathFile]);

jsonResponse(['success' => true, 'message' => 'Materi berhasil diunggah']);

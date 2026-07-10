<?php
require_once __DIR__ . '/../../includes/functions.php';
requireDosen();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$dosenId = $_SESSION['dosen_id'];

$mahasiswaId = (int) ($_POST['mahasiswa_id'] ?? 0);
$matkulId    = (int) ($_POST['matkul_id'] ?? 0);
$pesan       = bersihkan($_POST['pesan'] ?? '');

if ($mahasiswaId <= 0 || $matkulId <= 0 || $pesan === '') {
    jsonResponse(['success' => false, 'message' => 'Data pengingat tidak lengkap']);
}

// Pastikan mata kuliah ini milik dosen yang login
$stmtCek = $pdo->prepare('SELECT id FROM matakuliah WHERE id = ? AND dosen_id = ?');
$stmtCek->execute([$matkulId, $dosenId]);
if (!$stmtCek->fetch()) {
    jsonResponse(['success' => false, 'message' => 'Anda tidak memiliki akses ke mata kuliah ini'], 403);
}

// Pastikan mahasiswa ini terdaftar pada mata kuliah tersebut
$stmtCekMhs = $pdo->prepare('SELECT id FROM mahasiswa_matkul WHERE mahasiswa_id = ? AND matkul_id = ?');
$stmtCekMhs->execute([$mahasiswaId, $matkulId]);
if (!$stmtCekMhs->fetch()) {
    jsonResponse(['success' => false, 'message' => 'Mahasiswa tidak terdaftar pada mata kuliah ini']);
}

$stmt = $pdo->prepare('INSERT INTO notifikasi (mahasiswa_id, matkul_id, pesan) VALUES (?, ?, ?)');
$stmt->execute([$mahasiswaId, $matkulId, $pesan]);

jsonResponse(['success' => true, 'message' => 'Pengingat berhasil dikirim ke mahasiswa']);

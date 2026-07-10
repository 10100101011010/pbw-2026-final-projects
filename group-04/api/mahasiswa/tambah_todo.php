<?php
require_once __DIR__ . '/../../includes/functions.php';
requireMahasiswa();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$mahasiswaId = $_SESSION['mahasiswa_id'];

$judul    = bersihkan($_POST['judul'] ?? '');
$catatan  = bersihkan($_POST['catatan'] ?? '');
$tanggal  = $_POST['tanggal_reminder'] ?? '';

if ($judul === '') {
    jsonResponse(['success' => false, 'message' => 'Judul catatan wajib diisi']);
}

$tanggalFinal = ($tanggal !== '') ? $tanggal : null;

$stmt = $pdo->prepare('INSERT INTO todo_pribadi (mahasiswa_id, judul, catatan, tanggal_reminder) VALUES (?, ?, ?, ?)');
$stmt->execute([$mahasiswaId, $judul, $catatan, $tanggalFinal]);

jsonResponse(['success' => true, 'message' => 'Catatan berhasil ditambahkan']);

<?php
require_once __DIR__ . '/../../includes/functions.php';
requireMahasiswa();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$mahasiswaId = $_SESSION['mahasiswa_id'];
$matkulId = (int) ($_POST['matkul_id'] ?? 0);

if ($matkulId <= 0) {
    jsonResponse(['success' => false, 'message' => 'Mata kuliah tidak valid!']);
}

// Data tugas, pengumpulan, nilai, dan checklist tetap tersimpan aman di database
$stmt = $pdo->prepare('DELETE FROM mahasiswa_matkul WHERE mahasiswa_id = ? AND matkul_id = ?');
$stmt->execute([$mahasiswaId, $matkulId]);

jsonResponse(['success' => true, 'message' => 'Mata kuliah berhasil dihapus dari daftarmu']);

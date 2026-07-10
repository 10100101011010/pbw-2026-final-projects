<?php
require_once __DIR__ . '/../../includes/functions.php';
requireMahasiswa();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$mahasiswaId = $_SESSION['mahasiswa_id'];
$matkulDipilih = $_POST['matkul'] ?? [];

if (empty($matkulDipilih) || !is_array($matkulDipilih)) {
    jsonResponse(['success' => false, 'message' => 'Pilih minimal satu mata kuliah!']);
}

$stmt = $pdo->prepare('INSERT IGNORE INTO mahasiswa_matkul (mahasiswa_id, matkul_id) VALUES (?, ?)');
$jumlahDitambah = 0;
foreach ($matkulDipilih as $matkulId) {
    $matkulId = (int) $matkulId;
    if ($matkulId > 0) {
        $stmt->execute([$mahasiswaId, $matkulId]);
        $jumlahDitambah += $stmt->rowCount();
    }
}

jsonResponse(['success' => true, 'message' => $jumlahDitambah . ' mata kuliah berhasil ditambahkan']);

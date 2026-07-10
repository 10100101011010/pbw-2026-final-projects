<?php
require_once __DIR__ . '/../../includes/functions.php';
requireMahasiswa();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$mahasiswaId = $_SESSION['mahasiswa_id'];
$tugasId = (int) ($_POST['tugas_id'] ?? 0);

if ($tugasId <= 0) {
    jsonResponse(['success' => false, 'message' => 'Tugas tidak valid']);
}

// Pastikan tugas ini memang ada di salah satu mata kuliah yang diambil mahasiswa
$stmtCek = $pdo->prepare("
    SELECT t.id FROM tugas t
    JOIN mahasiswa_matkul mm ON mm.matkul_id = t.matkul_id
    WHERE t.id = ? AND mm.mahasiswa_id = ?
");
$stmtCek->execute([$tugasId, $mahasiswaId]);
if (!$stmtCek->fetch()) {
    jsonResponse(['success' => false, 'message' => 'Kamu tidak terdaftar pada mata kuliah tugas ini'], 403);
}

// Cek apakah sudah ada baris checklist untuk tugas + mahasiswa ini
$stmt = $pdo->prepare('SELECT * FROM checklist_tugas WHERE tugas_id = ? AND mahasiswa_id = ?');
$stmt->execute([$tugasId, $mahasiswaId]);
$row = $stmt->fetch();

if ($row) {
    $selesaiBaru = $row['selesai'] ? 0 : 1;
    $update = $pdo->prepare('UPDATE checklist_tugas SET selesai = ? WHERE id = ?');
    $update->execute([$selesaiBaru, $row['id']]);
} else {
    $selesaiBaru = 1;
    $insert = $pdo->prepare('INSERT INTO checklist_tugas (tugas_id, mahasiswa_id, selesai) VALUES (?, ?, 1)');
    $insert->execute([$tugasId, $mahasiswaId]);
}

jsonResponse(['success' => true, 'selesai' => (bool) $selesaiBaru]);

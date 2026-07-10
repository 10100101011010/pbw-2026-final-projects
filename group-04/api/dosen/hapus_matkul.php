<?php
require_once __DIR__ . '/../../includes/functions.php';
requireDosen();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$dosenId = $_SESSION['dosen_id'];
$matkulId = (int) ($_POST['matkul_id'] ?? 0);

if ($matkulId <= 0) {
    jsonResponse(['success' => false, 'message' => 'Mata kuliah tidak valid']);
}

$stmtCek = $pdo->prepare('SELECT id FROM matakuliah WHERE id = ? AND dosen_id = ?');
$stmtCek->execute([$matkulId, $dosenId]);
if (!$stmtCek->fetch()) {
    jsonResponse(['success' => false, 'message' => 'Anda tidak mengampu mata kuliah ini'], 403);
}

// Catatan: mata kuliah TIDAK dihapus, hanya dilepas kepemilikannya (dosen_id jadi kosong).
// Semua tugas, materi, mahasiswa yang sudah terdaftar tetap aman tersimpan.
$stmt = $pdo->prepare('UPDATE matakuliah SET dosen_id = NULL WHERE id = ?');
$stmt->execute([$matkulId]);

jsonResponse(['success' => true, 'message' => 'Anda berhenti mengampu mata kuliah ini']);

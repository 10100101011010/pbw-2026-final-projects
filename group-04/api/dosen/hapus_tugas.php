<?php
require_once __DIR__ . '/../../includes/functions.php';
requireDosen();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$dosenId = $_SESSION['dosen_id'];
$tugasId = (int) ($_POST['tugas_id'] ?? 0);

if ($tugasId <= 0) {
    jsonResponse(['success' => false, 'message' => 'Tugas tidak valid']);
}

// Pastikan tugas ini ada pada mata kuliah milik dosen yang login
$stmtCek = $pdo->prepare("
    SELECT t.id, t.path_file FROM tugas t
    JOIN matakuliah mk ON mk.id = t.matkul_id
    WHERE t.id = ? AND mk.dosen_id = ?
");
$stmtCek->execute([$tugasId, $dosenId]);
$tugas = $stmtCek->fetch();

if (!$tugas) {
    jsonResponse(['success' => false, 'message' => 'Anda tidak memiliki akses untuk menghapus tugas ini'], 403);
}

// Hapus lampiran soal (kalau ada) dari server
if (!empty($tugas['path_file'])) {
    $pathFisik = __DIR__ . '/../../' . $tugas['path_file'];
    if (file_exists($pathFisik)) {
        @unlink($pathFisik);
    }
}

// Menghapus baris tugas otomatis ikut menghapus data terkait (pengumpulan, checklist)
// karena foreign key-nya sudah diberi ON DELETE CASCADE di database.
$stmt = $pdo->prepare('DELETE FROM tugas WHERE id = ?');
$stmt->execute([$tugasId]);

jsonResponse(['success' => true, 'message' => 'Tugas berhasil dihapus']);
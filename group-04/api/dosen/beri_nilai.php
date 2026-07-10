<?php
require_once __DIR__ . '/../../includes/functions.php';
requireDosen();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$dosenId = $_SESSION['dosen_id'];

$pengumpulanId = (int) ($_POST['pengumpulan_id'] ?? 0);
$nilai = (int) ($_POST['nilai'] ?? -1);

if ($pengumpulanId <= 0 || $nilai < 0 || $nilai > 100) {
    jsonResponse(['success' => false, 'message' => 'Nilai tidak valid!']);
}

// Pastikan pengumpulan ini milik tugas pada mata kuliah yang diampu dosen ini
$stmtCek = $pdo->prepare("
    SELECT p.id FROM pengumpulan p
    JOIN tugas t ON t.id = p.tugas_id
    JOIN matakuliah mk ON mk.id = t.matkul_id
    WHERE p.id = ? AND mk.dosen_id = ?
");
$stmtCek->execute([$pengumpulanId, $dosenId]);
if (!$stmtCek->fetch()) {
    jsonResponse(['success' => false, 'message' => 'Anda tidak memiliki akses untuk menilai pengumpulan ini'], 403);
}

$stmt = $pdo->prepare('UPDATE pengumpulan SET nilai = ? WHERE id = ?');
$stmt->execute([$nilai, $pengumpulanId]);

jsonResponse(['success' => true, 'message' => 'Nilai berhasil disimpan']);

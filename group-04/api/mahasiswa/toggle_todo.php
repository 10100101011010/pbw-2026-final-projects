<?php
require_once __DIR__ . '/../../includes/functions.php';
requireMahasiswa();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$mahasiswaId = $_SESSION['mahasiswa_id'];
$todoId = (int) ($_POST['todo_id'] ?? 0);

$stmt = $pdo->prepare('SELECT * FROM todo_pribadi WHERE id = ? AND mahasiswa_id = ?');
$stmt->execute([$todoId, $mahasiswaId]);
$row = $stmt->fetch();

if (!$row) {
    jsonResponse(['success' => false, 'message' => 'Catatan tidak ditemukan'], 404);
}

$selesaiBaru = $row['selesai'] ? 0 : 1;
$update = $pdo->prepare('UPDATE todo_pribadi SET selesai = ? WHERE id = ?');
$update->execute([$selesaiBaru, $todoId]);

jsonResponse(['success' => true, 'selesai' => (bool) $selesaiBaru]);

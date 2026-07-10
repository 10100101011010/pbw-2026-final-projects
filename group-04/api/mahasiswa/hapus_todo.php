<?php
require_once __DIR__ . '/../../includes/functions.php';
requireMahasiswa();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$mahasiswaId = $_SESSION['mahasiswa_id'];
$todoId = (int) ($_POST['todo_id'] ?? 0);

$stmt = $pdo->prepare('DELETE FROM todo_pribadi WHERE id = ? AND mahasiswa_id = ?');
$stmt->execute([$todoId, $mahasiswaId]);

jsonResponse(['success' => true, 'message' => 'Catatan berhasil dihapus']);

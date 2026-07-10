<?php
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();

$npm      = bersihkan($_POST['npm'] ?? '');
$password = $_POST['password'] ?? '';

if ($npm === '' || $password === '') {
    jsonResponse(['success' => false, 'message' => 'NPM dan password wajib diisi!']);
}

$stmt = $pdo->prepare('SELECT * FROM mahasiswa WHERE npm = ?');
$stmt->execute([$npm]);
$mhs = $stmt->fetch();

if (!$mhs || !password_verify($password, $mhs['password'])) {
    jsonResponse(['success' => false, 'message' => 'NPM atau password salah']);
}

$_SESSION['mahasiswa_id']    = $mhs['id'];
$_SESSION['mahasiswa_nama']  = $mhs['nama'];
$_SESSION['mahasiswa_npm']   = $mhs['npm'];
$_SESSION['mahasiswa_foto']  = $mhs['foto_profil'];

// Cek apakah mahasiswa sudah memilih mata kuliah. Kalau belum, arahkan
// ke halaman pemilihan matkul dulu sebelum masuk dashboard.
$stmtCekMatkul = $pdo->prepare('SELECT COUNT(*) AS total FROM mahasiswa_matkul WHERE mahasiswa_id = ?');
$stmtCekMatkul->execute([$mhs['id']]);
$sudahPunyaMatkul = $stmtCekMatkul->fetch()['total'] > 0;

jsonResponse([
    'success'  => true,
    'message'  => 'Login berhasil, selamat datang ' . $mhs['nama'] . '!',
    'redirect' => $sudahPunyaMatkul ? 'dashboard_mahasiswa.php' : 'matkul_saya_mahasiswa.php'
]);
<?php
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();

$nip      = bersihkan($_POST['nip'] ?? '');
$password = $_POST['password'] ?? '';

if ($nip === '' || $password === '') {
    jsonResponse(['success' => false, 'message' => 'NIP dan password wajib diisi!']);
}

$stmt = $pdo->prepare('SELECT * FROM dosen WHERE nip = ?');
$stmt->execute([$nip]);
$dosen = $stmt->fetch();

if (!$dosen || !password_verify($password, $dosen['password'])) {
    jsonResponse(['success' => false, 'message' => 'NIP atau password salah']);
}

$_SESSION['dosen_id']   = $dosen['id'];
$_SESSION['dosen_nama'] = $dosen['nama'];
$_SESSION['dosen_nip']  = $dosen['nip'];
$_SESSION['dosen_foto'] = $dosen['foto_profil'];

jsonResponse([
    'success'  => true,
    'message'  => 'Login berhasil, selamat datang ' . $dosen['nama'] . '!',
    'redirect' => 'dashboard_dosen.php'
]);
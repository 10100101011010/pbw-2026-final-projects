<?php
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();

$nama     = bersihkan($_POST['nama'] ?? '');
$nip      = bersihkan($_POST['nip'] ?? '');
$email    = bersihkan($_POST['email'] ?? '');
$no_hp    = bersihkan($_POST['no_hp'] ?? '');
$password = $_POST['password'] ?? '';

if ($nama === '' || $nip === '' || $email === '' || $password === '') {
    jsonResponse(['success' => false, 'message' => 'Semua kolom wajib diisi dengan lengkap!']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Alamat email tidak valid']);
}

if (strlen($password) < 6) {
    jsonResponse(['success' => false, 'message' => 'Password minimal 6 karakter']);
}

$cek = $pdo->prepare('SELECT id FROM dosen WHERE nip = ?');
$cek->execute([$nip]);
if ($cek->fetch()) {
    jsonResponse(['success' => false, 'message' => 'NIP ini sudah terdaftar! Silakan login']);
}

try {
    $hashPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO dosen (nama, nip, email, no_hp, password) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$nama, $nip, $email, $no_hp, $hashPassword]);

    jsonResponse(['success' => true, 'message' => 'Pendaftaran berhasil! Silakan login menggunakan NIP & password Anda']);

} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Pendaftaran gagal, silakan coba lagi']);
}

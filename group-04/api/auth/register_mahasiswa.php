<?php
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();

$nama     = bersihkan($_POST['nama'] ?? '');
$npm      = bersihkan($_POST['npm'] ?? '');
$kelas    = bersihkan($_POST['kelas'] ?? '');
$jurusan  = bersihkan($_POST['jurusan'] ?? '');
$semester = (int) ($_POST['semester'] ?? 0);
$email    = bersihkan($_POST['email'] ?? '');
$no_hp    = bersihkan($_POST['no_hp'] ?? '');
$password = $_POST['password'] ?? '';

// ---------- VALIDASI ----------
if ($nama === '' || $npm === '' || $email === '' || $password === '' || $semester <= 0) {
    jsonResponse(['success' => false, 'message' => 'Semua kolom wajib diisi dengan lengkap!']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !str_ends_with(strtolower($email), '@gmail.com')) {
    jsonResponse(['success' => false, 'message' => 'Gunakan alamat email Gmail yang aktif dan valid']);
}

if (strlen($password) < 6) {
    jsonResponse(['success' => false, 'message' => 'Password minimal 6 karakter']);
}

// Cek NPM sudah terdaftar atau belum
$cek = $pdo->prepare('SELECT id FROM mahasiswa WHERE npm = ?');
$cek->execute([$npm]);
if ($cek->fetch()) {
    jsonResponse(['success' => false, 'message' => 'NPM ini sudah terdaftar! Silakan login']);
}

try {
    $hashPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare('INSERT INTO mahasiswa (nama, npm, kelas, jurusan, semester, email, no_hp, password)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$nama, $npm, $kelas, $jurusan, $semester, $email, $no_hp, $hashPassword]);

    jsonResponse(['success' => true, 'message' => 'Pendaftaran berhasil! Silakan login menggunakan NPM & password kamu']);

} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Pendaftaran gagal, silakan coba lagi']);
}

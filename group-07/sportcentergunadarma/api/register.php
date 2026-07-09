<?php
/**
 * api: registrasi akun mahasiswa baru.
 * dipanggil oleh assets/js/auth.js lewat fetch() dari halaman register.php.
 * ada field konfirmasi_password (tambahan dari draft sebelumnya) supaya
 * mahasiswa tidak salah ketik password tanpa sadar saat daftar.
 * method: post
 * body  : npm, nama, email, password, konfirmasi_password
 *
 * lapisan: logic/api
 */
require_once '../config/database.php';
require_once '../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'metode tidak diizinkan');
}

$npm = sanitize($_POST['npm'] ?? '');
$nama = sanitize($_POST['nama'] ?? '');
$email = sanitize($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$konfirmasi_password = $_POST['konfirmasi_password'] ?? '';

// validasi input dasar
if (!$npm || !$nama || !$email || !$password || !$konfirmasi_password) {
    jsonResponse(false, 'semua field wajib diisi');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, 'format email tidak valid');
}
if (strlen($password) < 6) {
    jsonResponse(false, 'password minimal 6 karakter');
}
if ($password !== $konfirmasi_password) {
    jsonResponse(false, 'konfirmasi password tidak cocok');
}

$db = (new Database())->getConnection();

// cek apakah npm atau email sudah dipakai sebelumnya
$check = $db->prepare("SELECT id FROM users WHERE npm = ? OR email = ?");
$check->execute([$npm, $email]);
if ($check->rowCount() > 0) {
    jsonResponse(false, 'npm atau email sudah terdaftar, silakan login');
}

// password di-hash pakai bcrypt sebelum disimpan, tidak pernah disimpan plain text
$hashed = password_hash($password, PASSWORD_BCRYPT);

$stmt = $db->prepare("INSERT INTO users (npm, nama, email, password, role) VALUES (?, ?, ?, ?, 'mahasiswa')");
$stmt->execute([$npm, $nama, $email, $hashed]);

jsonResponse(true, 'registrasi berhasil, silakan login');

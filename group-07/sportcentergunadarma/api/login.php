<?php
/**
 * api: login untuk mahasiswa maupun admin/petugas.
 * bisa login pakai npm atau email, satu form untuk keduanya.
 * method: post
 * body  : identifier (npm/email), password
 *
 * lapisan: logic/api
 */
require_once '../config/database.php';
require_once '../includes/auth.php';
require_once '../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'metode tidak diizinkan');
}

$identifier = sanitize($_POST['identifier'] ?? '');
$password = $_POST['password'] ?? '';

if (!$identifier || !$password) {
    jsonResponse(false, 'npm/email dan password wajib diisi');
}

$db = (new Database())->getConnection();
$stmt = $db->prepare("SELECT * FROM users WHERE npm = ? OR email = ?");
$stmt->execute([$identifier, $identifier]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// password_verify membandingkan password mentah dengan hash bcrypt di database
if (!$user || !password_verify($password, $user['password'])) {
    jsonResponse(false, 'npm/email atau password salah');
}

// simpan data penting ke session, dipakai di seluruh halaman untuk cek login & role
$_SESSION['user_id'] = $user['id'];
$_SESSION['nama'] = $user['nama'];
$_SESSION['npm'] = $user['npm'];
$_SESSION['role'] = $user['role'];

jsonResponse(true, 'login berhasil', ['role' => $user['role']]);

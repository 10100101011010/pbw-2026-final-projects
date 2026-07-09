<?php
/**
 * api: langkah 2 dari alur konfirmasi kedatangan.
 * dipanggil setelah petugas menekan tombol "konfirmasi sekarang" di layar,
 * yang berarti petugas sudah mencocokkan nama & npm dari api/cek_kode.php
 * dengan ktm fisik mahasiswa. di sinilah status booking benar-benar berubah
 * jadi "confirmed" dan dicatat jam serta petugas yang mengonfirmasi.
 *
 * catatan penting: validasi "sudah waktunya belum" (opsi a, lihat penjelasan
 * lengkap di api/cek_kode.php) DIULANG lagi di sini, bukan cuma dipercaya dari
 * hasil cek_kode.php sebelumnya. ini "defense in depth" -- kalau ada yang coba
 * kirim request langsung ke checkin.php tanpa lewat cek_kode.php dulu (misalnya
 * pakai postman), backend tetap menolak booking yang belum waktunya.
 *
 * method: post
 * body  : booking_id
 *
 * lapisan: logic/api
 */
require_once '../config/database.php';
require_once '../includes/auth.php';
require_once '../includes/functions.php';

if (!isAdmin()) {
    jsonResponse(false, 'akses ditolak, hanya admin/petugas yang bisa konfirmasi');
}

$booking_id = $_POST['booking_id'] ?? null;
if (!$booking_id) {
    jsonResponse(false, 'id booking tidak valid');
}

$db = (new Database())->getConnection();
$stmt = $db->prepare("SELECT * FROM booking WHERE id = ?");
$stmt->execute([$booking_id]);
$booking = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$booking) {
    jsonResponse(false, 'booking tidak ditemukan');
}
if ($booking['status'] !== 'pending') {
    jsonResponse(false, 'booking ini sudah tidak berstatus menunggu konfirmasi');
}

// ulangi validasi "sudah waktunya belum" sesuai opsi a (lihat api/cek_kode.php)
$hariIniServer = date('Y-m-d');
$jamSekarangServer = date('H:i');
$sudahWaktunya = ($booking['tanggal'] < $hariIniServer)
    || ($booking['tanggal'] === $hariIniServer && $jamSekarangServer >= substr($booking['jam_mulai'], 0, 5));

if (!$sudahWaktunya) {
    jsonResponse(false, 'belum waktunya, booking ini baru bisa dikonfirmasi mulai jam ' . substr($booking['jam_mulai'], 0, 5));
}

$update = $db->prepare(
    "UPDATE booking SET status = 'confirmed', checked_in_at = NOW(), checked_in_by = ? WHERE id = ?"
);
$update->execute([$_SESSION['user_id'], $booking['id']]);

jsonResponse(true, 'kedatangan mahasiswa berhasil dikonfirmasi. silakan persilakan mahasiswa menggunakan lapangan.');

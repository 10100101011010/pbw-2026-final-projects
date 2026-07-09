<?php
/**
 * api: admin/petugas membatalkan booking milik siapapun. dulu ada juga
 * fitur mahasiswa membatalkan booking sendiri (api/cancel_booking.php),
 * tapi fitur itu sudah dihapus -- sekarang cuma admin yang bisa membatalkan.
 * dipakai kalau ada mahasiswa yang minta batal langsung ke petugas secara
 * lisan/di tempat, atau ada kesalahan input yang perlu diluruskan admin.
 *
 * catatan pembatalan WAJIB diisi admin tiap kali membatalkan, biar mahasiswa
 * yang bookingnya dibatalkan tau alasannya waktu dia cek riwayat.php.
 *
 * begitu status diubah jadi 'cancelled', jadwal jam tersebut OTOMATIS terbuka
 * lagi untuk mahasiswa lain -- tidak perlu langkah tambahan apapun, karena cek
 * bentrok di api/booking.php maupun api/get_jadwal.php cuma menghitung booking
 * berstatus 'pending'/'confirmed' saja, bukan yang sudah 'cancelled'.
 *
 * method: post
 * body  : booking_id, catatan_pembatalan
 *
 * lapisan: logic/api
 */
require_once '../config/database.php';
require_once '../includes/auth.php';
require_once '../includes/functions.php';

if (!isAdmin()) {
    jsonResponse(false, 'akses ditolak, hanya admin/petugas yang bisa membatalkan booking mahasiswa');
}

$booking_id = $_POST['booking_id'] ?? null;
$catatan = trim($_POST['catatan_pembatalan'] ?? '');

if (!$booking_id) {
    jsonResponse(false, 'id booking tidak valid');
}
// catatan wajib diisi -- ini yang bikin mahasiswa tau alasan booking-nya
// dibatalkan, bukan cuma lihat status "dibatalkan" tanpa penjelasan apapun
if ($catatan === '') {
    jsonResponse(false, 'catatan pembatalan wajib diisi, biar mahasiswa tau alasannya');
}

$db = (new Database())->getConnection();
$stmt = $db->prepare("SELECT * FROM booking WHERE id = ?");
$stmt->execute([$booking_id]);
$booking = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$booking) {
    jsonResponse(false, 'booking tidak ditemukan');
}
if ($booking['status'] === 'cancelled') {
    jsonResponse(false, 'booking ini sudah dibatalkan sebelumnya');
}

// catat siapa admin yang membatalkan (kolom dibatalkan_oleh_admin) dan alasannya
// (kolom catatan_pembatalan) -- berguna buat jejak audit kalau suatu saat
// ditanya "kenapa booking ini batal", dan buat mahasiswa lihat alasannya di riwayat.php
$update = $db->prepare("UPDATE booking SET status = 'cancelled', dibatalkan_oleh_admin = ?, catatan_pembatalan = ? WHERE id = ?");
$update->execute([$_SESSION['user_id'], sanitize($catatan), $booking_id]);

jsonResponse(true, 'booking berhasil dibatalkan oleh admin, jadwal jam tersebut sudah terbuka lagi untuk mahasiswa lain');

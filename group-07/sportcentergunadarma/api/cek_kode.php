<?php
/**
 * api: langkah 1 dari alur konfirmasi kedatangan.
 * petugas mengetik kode booking, sistem MENAMPILKAN data mahasiswa
 * (nama, npm, jadwal, no hp) TANPA mengubah status apapun dulu.
 * petugas lalu mencocokkan data ini dengan ktm fisik mahasiswa secara manual.
 * kalau cocok, baru dilanjutkan ke api/checkin.php (langkah 2) untuk konfirmasi final.
 *
 * perubahan dibanding draft sebelumnya (kesepakatan "opsi a"):
 * dulu ada hard block: kalau tanggal booking != hari ini (persis), langsung
 * ditolak total dengan pesan "booking ini bukan untuk hari ini". itu artinya
 * demo ke dosen jadi kaku (cuma bisa didemokan kalau kebetulan tanggalnya pas).
 * aturan baru yang dipakai sekarang, sesuai kesepakatan:
 * - boleh dikonfirmasi kalau: tanggal booking SUDAH LEWAT (kemarin atau
 *   sebelumnya), ATAU tanggal booking = HARI INI dan jam sekarang (server)
 *   SUDAH SAMA DENGAN atau LEBIH DARI jam_mulai booking itu.
 * - BELUM boleh dikonfirmasi (hard block, tombol tidak aktif) kalau tanggal
 *   booking masih di MASA DEPAN, atau tanggalnya hari ini tapi jam sekarang
 *   MASIH LEBIH AWAL dari jam_mulai booking (belum waktunya).
 * - sengaja TIDAK ADA batas atas (boleh dikonfirmasi kapan saja walau
 *   jam_selesai booking itu sudah lewat jauh, misal mahasiswa telat datang) --
 *   ini "opsi a" yang disepakati, karena butuh mekanisme cron/job otomatis
 *   terpisah kalau mau auto-expire booking yang lewat jam_selesai, dan itu
 *   BELUM diimplementasikan (dicatat di readme sebagai roadmap "coming soon").
 *
 * method: post
 * body  : kode_booking
 *
 * lapisan: logic/api
 */
require_once '../config/database.php';
require_once '../includes/auth.php';
require_once '../includes/functions.php';

if (!isAdmin()) {
    jsonResponse(false, 'akses ditolak, hanya admin/petugas yang bisa mengecek kode');
}

$kode_booking = strtoupper(sanitize($_POST['kode_booking'] ?? ''));
if (!$kode_booking) {
    jsonResponse(false, 'kode booking wajib diisi');
}

$db = (new Database())->getConnection();
$stmt = $db->prepare(
    "SELECT b.*, u.nama, u.npm, l.nama as nama_lapangan
     FROM booking b
     JOIN users u ON b.user_id = u.id
     JOIN lapangan l ON b.lapangan_id = l.id
     WHERE b.kode_booking = ?"
);
$stmt->execute([$kode_booking]);
$booking = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$booking) {
    jsonResponse(false, 'kode booking tidak ditemukan');
}
if ($booking['status'] === 'confirmed') {
    jsonResponse(false, 'booking ini sudah pernah dikonfirmasi sebelumnya', $booking);
}
if ($booking['status'] === 'cancelled') {
    jsonResponse(false, 'booking ini sudah dibatalkan, tidak bisa dikonfirmasi', $booking);
}

// cek "sudah waktunya belum" sesuai aturan opsi a di atas
$hariIniServer = date('Y-m-d');
$jamSekarangServer = date('H:i');
$sudahWaktunya = ($booking['tanggal'] < $hariIniServer)
    || ($booking['tanggal'] === $hariIniServer && $jamSekarangServer >= substr($booking['jam_mulai'], 0, 5));

if (!$sudahWaktunya) {
    if ($booking['tanggal'] > $hariIniServer) {
        $pesan = 'belum waktunya, booking ini untuk tanggal ' . formatTanggalIndo($booking['tanggal']) . ' jam ' . substr($booking['jam_mulai'], 0, 5);
    } else {
        $pesan = 'belum waktunya, booking ini baru bisa dikonfirmasi mulai jam ' . substr($booking['jam_mulai'], 0, 5) . ' hari ini';
    }
    // data booking tetap dikirim ($booking) supaya petugas bisa lihat detailnya,
    // TAPI tombol konfirmasi di frontend akan disembunyikan (lihat assets/js/admin.js)
    jsonResponse(false, $pesan, $booking);
}

jsonResponse(true, 'kode ditemukan. cocokkan data berikut dengan ktm mahasiswa.', $booking);

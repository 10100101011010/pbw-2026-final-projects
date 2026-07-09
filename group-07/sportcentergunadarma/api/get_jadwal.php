<?php
/**
 * api: mengambil semua informasi jadwal yang dibutuhkan javascript untuk
 * menggambar dropdown "jam mulai" di halaman booking.php, untuk SATU lapangan
 * di SATU tanggal tertentu. ini file yang paling banyak berubah dari versi
 * sebelumnya, karena sekarang jam operasional tidak lagi tetap sepanjang hari,
 * tapi tergantung hari apa tanggal itu (lihat jamOperasionalHari() di
 * includes/functions.php untuk aturan lengkapnya).
 *
 * yang dikembalikan ke javascript:
 * - libur          : true kalau tanggal itu hari minggu (sport center tutup total)
 * - jam_buka       : jam buka di tanggal itu, contoh "09:00" (null kalau libur)
 * - jam_tutup      : jam tutup di tanggal itu, contoh "20:00" (null kalau libur)
 * - jam_terisi     : daftar jam yang sudah dibooking mahasiswa lain (pending/confirmed)
 * - jam_sekarang   : jam saat ini di server, format "HH:MM" -- dipakai javascript
 *                     untuk menyembunyikan slot yang sudah lewat, TAPI HANYA kalau
 *                     tanggal yang dipilih mahasiswa adalah hari ini juga
 * - apakah_hari_ini: true kalau tanggal yang diminta sama dengan tanggal hari ini
 *
 * kenapa jam_sekarang diambil dari server, bukan dari jam komputer mahasiswa?
 * supaya tidak bisa dicurangi dengan mengubah jam di laptop/hp sendiri.
 *
 * method: get
 * query : lapangan_id, tanggal (format yyyy-mm-dd)
 *
 * lapisan: logic/api
 */
require_once '../config/database.php';
require_once '../includes/functions.php';

$lapangan_id = $_GET['lapangan_id'] ?? null;
$tanggal = $_GET['tanggal'] ?? null;

if (!$lapangan_id || !$tanggal) {
    jsonResponse(false, 'parameter tidak lengkap');
}

// tentukan jam operasional hari itu (null kalau hari minggu / libur)
$jamOperasional = jamOperasionalHari($tanggal);

$db = (new Database())->getConnection();
$stmt = $db->prepare(
    "SELECT jam_mulai, jam_selesai FROM booking
     WHERE lapangan_id = ? AND tanggal = ? AND status IN ('pending','confirmed')
     ORDER BY jam_mulai ASC"
);
$stmt->execute([$lapangan_id, $tanggal]);
$booked = $stmt->fetchAll(PDO::FETCH_ASSOC);

$hariIni = date('Y-m-d');

jsonResponse(true, 'ok', [
    'libur' => $jamOperasional === null,
    'jam_buka' => $jamOperasional['buka'] ?? null,
    'jam_tutup' => $jamOperasional['tutup'] ?? null,
    'jam_terisi' => $booked,
    'jam_sekarang' => date('H:i'),
    'apakah_hari_ini' => ($tanggal === $hariIni),
]);

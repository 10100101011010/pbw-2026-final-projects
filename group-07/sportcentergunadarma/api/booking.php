<?php
/**
 * api: membuat booking baru.
 * ini file paling penting di seluruh sistem -- validasi tanggal, validasi jam,
 * cek jam operasional, cek bentrok jadwal, simpan nomor hp, lalu generate kode
 * booking unik yang nanti ditunjukkan mahasiswa ke petugas beserta ktm.
 *
 * perbaikan dibanding draft "gemini" sebelumnya (root cause bug yang dilaporkan):
 * - dulu TIDAK ADA validasi tanggal lampau di backend sama sekali, cuma
 *   mengandalkan atribut html min="..." di kalender -- itu validasi di
 *   BROWSER, gampang dilewati (misalnya lewat request langsung tanpa buka
 *   halaman). sekarang backend menolak tegas kalau tanggal sudah lewat.
 * - dulu jam operasional diambil dari kolom jam_buka/jam_tutup per-lapangan
 *   di database, padahal yang diminta itu aturan GLOBAL per hari (senin-jumat/
 *   sabtu/minggu). sekarang pakai jamOperasionalHari() dari functions.php,
 *   satu sumber kebenaran yang sama dipakai api/get_jadwal.php juga.
 * - durasi maksimal sekarang divalidasi juga di backend, bukan cuma
 *   dibatasi lewat pilihan dropdown di frontend (yang bisa dilewati).
 *
 * method: post
 * body  : lapangan_id, tanggal, jam_mulai, jam_selesai, durasi_jam, no_hp
 *
 * lapisan: logic/api
 */
require_once '../config/database.php';
require_once '../includes/auth.php';
require_once '../includes/functions.php';

if (!isLoggedIn()) {
    jsonResponse(false, 'silakan login terlebih dahulu');
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'metode tidak diizinkan');
}
// admin/petugas tugasnya cuma verifikasi ktm mahasiswa lain, jadi dia sendiri
// tidak boleh ikut booking lapangan atas namanya sendiri (lapis proteksi ke-2,
// lapis pertama ada di level halaman booking.php)
if (isAdmin()) {
    jsonResponse(false, 'akun admin/petugas tidak bisa melakukan booking, silakan gunakan akun mahasiswa');
}

$lapangan_id = $_POST['lapangan_id'] ?? null;
$tanggal = $_POST['tanggal'] ?? null;
$jam_mulai = $_POST['jam_mulai'] ?? null;
$jam_selesai = $_POST['jam_selesai'] ?? null;
$no_hp = trim($_POST['no_hp'] ?? '');

if (!$lapangan_id || !$tanggal || !$jam_mulai || !$jam_selesai || !$no_hp) {
    jsonResponse(false, 'data booking tidak lengkap, nomor hp wajib diisi');
}

if (!validasiNoHp($no_hp)) {
    jsonResponse(false, 'format nomor hp tidak valid, isi angka saja (9-15 digit)');
}

// validasi format tanggal dasar dulu, supaya strtotime() di bawah tidak
// menerima input aneh-aneh yang bukan tanggal sungguhan
$tanggalValid = DateTime::createFromFormat('Y-m-d', $tanggal);
if (!$tanggalValid || $tanggalValid->format('Y-m-d') !== $tanggal) {
    jsonResponse(false, 'format tanggal tidak valid');
}

// ##### PERBAIKAN UTAMA #1: tanggal yang sudah lewat ditolak tegas di backend #####
// dibandingkan sebagai string "yyyy-mm-dd" langsung bisa, karena format ini
// urutannya besar-ke-kecil (tahun-bulan-tanggal) jadi perbandingan string = perbandingan tanggal asli
$hariIniServer = date('Y-m-d');
if ($tanggal < $hariIniServer) {
    jsonResponse(false, 'tidak bisa booking untuk tanggal yang sudah lewat');
}

// ##### PERBAIKAN UTAMA #2: jam yang sudah lewat HARI INI ditolak di backend #####
// jam_sekarang diambil dari waktu SERVER, bukan waktu komputer/hp mahasiswa,
// supaya tidak bisa dicurangi dengan mengubah jam di device sendiri
if ($tanggal === $hariIniServer && $jam_mulai <= date('H:i')) {
    jsonResponse(false, 'tidak bisa booking untuk jam yang sudah terlewat pada hari ini');
}

if (strtotime($jam_mulai) >= strtotime($jam_selesai)) {
    jsonResponse(false, 'jam mulai harus lebih awal dari jam selesai');
}

// ##### PERBAIKAN UTAMA #3: durasi maksimal 2 jam divalidasi juga di backend #####
// supaya tidak bisa dilewati dengan mengirim jam_selesai custom langsung ke api
$durasiMenit = (strtotime($jam_selesai) - strtotime($jam_mulai)) / 60;
if ($durasiMenit > 120) {
    jsonResponse(false, 'durasi booking maksimal 2 jam');
}

$db = (new Database())->getConnection();

// pastikan lapangan ada dan masih aktif
$lap = $db->prepare("SELECT * FROM lapangan WHERE id = ? AND status = 'aktif'");
$lap->execute([$lapangan_id]);
$lapangan = $lap->fetch(PDO::FETCH_ASSOC);
if (!$lapangan) {
    jsonResponse(false, 'lapangan tidak ditemukan');
}

// ##### PERBAIKAN UTAMA #4: jam operasional sekarang GLOBAL per-hari, #####
// ##### bukan lagi kolom jam_buka/jam_tutup milik masing-masing lapangan #####
$jamOperasional = jamOperasionalHari($tanggal);
if ($jamOperasional === null) {
    jsonResponse(false, 'sport center libur setiap hari minggu, silakan pilih tanggal lain');
}
if ($jam_mulai < $jamOperasional['buka'] || $jam_selesai > $jamOperasional['tutup']) {
    jsonResponse(false, 'jam di luar jam operasional (' . $jamOperasional['buka'] . ' - ' . $jamOperasional['tutup'] . ' untuk tanggal ini)');
}

// cek bentrok: ada booking lain (pending/confirmed) yang overlap dengan jam yang diminta
$cek = $db->prepare(
    "SELECT id FROM booking
     WHERE lapangan_id = ? AND tanggal = ? AND status IN ('pending','confirmed')
     AND (jam_mulai < ? AND jam_selesai > ?)"
);
$cek->execute([$lapangan_id, $tanggal, $jam_selesai, $jam_mulai]);
if ($cek->rowCount() > 0) {
    jsonResponse(false, 'jadwal bentrok dengan booking lain, silakan pilih jam lain');
}

// generate kode booking, ulangi kalau ternyata sudah dipakai (sangat jarang terjadi)
do {
    $kode = generateBookingCode();
    $cekKode = $db->prepare("SELECT id FROM booking WHERE kode_booking = ?");
    $cekKode->execute([$kode]);
} while ($cekKode->rowCount() > 0);

$stmt = $db->prepare(
    "INSERT INTO booking (kode_booking, user_id, lapangan_id, tanggal, jam_mulai, jam_selesai, no_hp, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')"
);
$stmt->execute([$kode, $_SESSION['user_id'], $lapangan_id, $tanggal, $jam_mulai, $jam_selesai, $no_hp]);

jsonResponse(true, 'booking berhasil dibuat', [
    'kode_booking' => $kode,
]);

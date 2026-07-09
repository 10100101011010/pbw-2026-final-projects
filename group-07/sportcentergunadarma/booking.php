<?php
$root = '';
require_once 'includes/auth.php';
require_once 'config/database.php';
require_once 'includes/functions.php';
requireLogin($root);

// admin/petugas tugasnya cuma verifikasi ktm mahasiswa lain saat datang,
// jadi dia sendiri tidak boleh ikut booking lapangan (lapis proteksi ke-1,
// lapis ke-2 ada di api/booking.php supaya tidak bisa dilewati lewat request langsung)
if (isAdmin()) {
    header('Location: index.php');
    exit();
}

$lapangan_id = $_GET['id'] ?? null;
if (!$lapangan_id) {
    header('Location: index.php');
    exit();
}

$db = (new Database())->getConnection();
$stmt = $db->prepare("SELECT * FROM lapangan WHERE id = ? AND status = 'aktif'");
$stmt->execute([$lapangan_id]);
$lapangan = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$lapangan) {
    header('Location: index.php');
    exit();
}

$page_title = 'Sewa ' . $lapangan['nama'];
require_once 'includes/header.php';
?>

<div class="max-w-2xl mx-auto">
  <a href="index.php" class="text-sm text-primary-700 hover:underline">&larr; Kembali ke daftar lapangan</a>

  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
    <span class="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full"><?= htmlspecialchars($lapangan['jenis']) ?></span>
    <h1 class="text-2xl font-bold text-gray-800 mt-2"><?= htmlspecialchars($lapangan['nama']) ?></h1>
    <p class="text-gray-500 mt-1"><?= htmlspecialchars($lapangan['lokasi']) ?></p>
    <p class="text-gray-600 mt-2"><?= htmlspecialchars($lapangan['deskripsi']) ?></p>
    <span class="inline-block mt-3 text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">Gratis, cukup verifikasi KTM</span>
    <!-- jam operasional TIDAK lagi ditampilkan statis dari database di sini,
         karena sekarang jam operasional tergantung tanggal yang dipilih
         (senin-jumat/sabtu/minggu beda aturan). info jam operasional untuk
         tanggal yang dipilih muncul otomatis di bawah, setelah pilih tanggal -->
  </div>

  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
    <h2 class="text-lg font-bold text-gray-800 mb-4">Pilih Jadwal</h2>
    <div id="info-jam-operasional" class="mb-4 p-3 rounded-lg text-sm bg-gray-50 text-gray-500">pilih tanggal dulu untuk melihat jam operasional</div>
    <div id="alert" class="hidden mb-4 p-3 rounded-lg text-sm"></div>

    <form id="form-booking" class="space-y-4">
      <input type="hidden" name="lapangan_id" value="<?= (int) $lapangan['id'] ?>">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
        <input type="date" name="tanggal" id="input-tanggal" required min="<?= date('Y-m-d') ?>" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
          <!-- ini widget pilihan slot, opsinya digenerate lewat js berdasarkan jam
               operasional TANGGAL YANG DIPILIH (bukan lagi tetap sepanjang hari),
               dan otomatis nandain slot mana yang sudah kepakai orang lain ATAU
               sudah lewat waktu sekarang (khusus kalau tanggalnya hari ini) -->
          <select name="jam_mulai" id="pilih-jam-mulai" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">pilih tanggal dulu</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Durasi</label>
          <!-- durasi maksimal cuma 2 pilihan (1 jam / 2 jam), dan ini juga divalidasi
               ULANG di server (api/booking.php) supaya tidak bisa dilewati -->
          <select name="durasi_jam" id="pilih-durasi" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="1">1 jam</option>
            <option value="2">2 jam</option>
          </select>
        </div>
        <!-- jam_selesai dihitung otomatis dari jam_mulai + durasi di booking.js, tetap dikirim
             ke server supaya validasi bentrok di backend tidak berubah sama sekali -->
        <input type="hidden" name="jam_selesai" id="input-jam-selesai">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nomor HP Aktif</label>
        <!-- nomor hp baru, wajib diisi supaya petugas bisa menghubungi mahasiswa
             kalau ada masalah/perubahan jadwal -->
        <input type="tel" name="no_hp" id="input-no-hp" required placeholder="contoh: 081234567890"
          pattern="[0-9+\-\s]{9,15}"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
      </div>

      <div id="jadwal-terisi" class="text-sm text-gray-500"></div>

      <button type="submit" class="w-full bg-primary-700 text-white py-2.5 rounded-lg font-medium hover:bg-primary-800">Booking Sekarang</button>
    </form>
  </div>

  <div id="hasil-booking" class="hidden bg-primary-50 border border-primary-200 rounded-2xl p-6 mt-6 text-center">
    <p class="text-primary-700 font-medium">Booking berhasil! Tunjukkan kode ini beserta KTM kamu ke petugas sport center:</p>
    <p id="kode-booking" class="text-4xl font-extrabold text-primary-800 tracking-widest mt-3"></p>
    <a href="riwayat.php" class="inline-block mt-4 text-sm text-primary-700 underline">Lihat riwayat booking saya</a>
  </div>
</div>

<script>
const lapanganId = <?= (int) $lapangan['id'] ?>;
const namaLapangan = <?= json_encode($lapangan['nama']) ?>;
// catatan: jamBuka/jamTutup TIDAK lagi dikirim tetap dari php seperti draft
// sebelumnya, karena sekarang jam operasional tergantung hari apa tanggal
// yang dipilih (lihat assets/js/booking.js, diambil dinamis lewat fetch
// ke api/get_jadwal.php tiap kali tanggal berganti)
</script>
<script src="assets/js/booking.js"></script>
<?php require_once 'includes/footer.php'; ?>

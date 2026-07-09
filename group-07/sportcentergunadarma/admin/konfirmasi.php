<?php
$root = '../';
require_once '../includes/auth.php';
require_once '../includes/functions.php';
requireAdmin($root);
$page_title = 'Konfirmasi Kedatangan';
require_once '../includes/header.php';
?>

<div class="max-w-6xl mx-auto px-4 py-8">

  <h1 class="text-2xl font-bold text-gray-800 mb-2">Konfirmasi Kedatangan Mahasiswa</h1>
  <p class="text-gray-500 mb-6">Minta mahasiswa menunjukkan kode booking, lalu cocokkan nama &amp; NPM yang muncul dengan KTM fisik sebelum menekan tombol konfirmasi. Tombol konfirmasi hanya aktif kalau sudah waktunya (lihat jam mulai booking).</p>

  <div class="max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
    <div id="alert" class="hidden mb-4 p-3 rounded-lg text-sm"></div>

    <form id="form-cek-kode" class="flex gap-2">
      <input type="text" name="kode_booking" placeholder="Masukkan kode booking" required
        class="flex-1 border border-gray-300 rounded-lg px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-primary-500">
      <button type="submit" class="bg-primary-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-800">Cek</button>
    </form>

    <div id="detail-booking" class="hidden mt-5 border-t border-gray-100 pt-4">
      <p class="text-sm text-gray-500">Nama / NPM Mahasiswa</p>
      <p id="detail-nama" class="font-bold text-gray-800 text-lg"></p>
      <p class="text-sm text-gray-500 mt-2">Lapangan &amp; Jadwal</p>
      <p id="detail-jadwal" class="font-medium text-gray-800"></p>
      <p class="text-sm text-gray-500 mt-2">No HP Mahasiswa</p>
      <p id="detail-hp" class="font-medium text-gray-800"></p>
      <p class="text-xs text-gray-400 mt-3 mb-3">Pastikan data di atas cocok dengan KTM yang ditunjukkan mahasiswa.</p>
      <button id="btn-konfirmasi" class="w-full bg-primary-700 text-white py-2.5 rounded-lg font-medium hover:bg-primary-800">
        ✅ Data Cocok dengan KTM, Konfirmasi Sekarang
      </button>
    </div>
  </div>

  <h2 class="text-lg font-bold text-gray-800 mb-4">Booking Menunggu Konfirmasi Hari Ini</h2>
  <div id="daftar-pending" class="space-y-3 mb-10"></div>

  <div class="flex items-center justify-between mb-4">
    <h2 class="text-lg font-bold text-gray-800">Riwayat Semua Booking</h2>
    <span id="badge-baru" class="hidden text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full animate-pulse">
      ● ada booking baru
    </span>
  </div>

  <div class="flex gap-2 mb-4 text-sm">
    <button data-filter="semua" class="filter-status bg-primary-700 text-white px-3 py-1.5 rounded-lg">Semua</button>
    <button data-filter="pending" class="filter-status bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">Pending</button>
    <button data-filter="confirmed" class="filter-status bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">Terkonfirmasi</button>
    <button data-filter="cancelled" class="filter-status bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">Dibatalkan</button>
  </div>

  <div id="daftar-riwayat" class="space-y-3"></div>

</div>

<script src="../assets/js/admin.js"></script>
<?php require_once '../includes/footer.php'; ?>
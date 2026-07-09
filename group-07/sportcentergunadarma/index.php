<?php
$root = '';
require_once 'includes/auth.php';
require_once 'includes/functions.php';
$page_title = 'Sport Center Gunadarma - Sewa Lapangan';
require_once 'includes/header.php';
?>

<!-- bagian hero, sengaja pakai -mx-4 -mt-8 buat "membatalkan" padding & batas lebar
     yang sudah dipasang <main> di header.php, supaya kotak ungu ini kelihatan
     full lebar kiri-kanan kayak react, TANPA perlu menutup/membuka tag <main>
     dua kali (itu penyebab bug kotak putih kosong di draft sebelumnya, sudah
     dijelaskan di includes/header.php) -->
<section class="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
  <div class="max-w-6xl mx-auto px-4 py-20 text-center">
    <h1 class="text-4xl md:text-5xl font-extrabold">Sport Center Gunadarma</h1>

    <p class="text-primary-100 mt-4 max-w-xl mx-auto">
      sewa lapangan olahraga di kampus H gratis tanpa biaya, cukup tunjukkan ktm ke petugas saat datang
    </p>

    <div id="ringkasan-hero" class="flex flex-wrap justify-center gap-4 mt-8 text-sm">
      <div class="bg-white/10 rounded-xl px-5 py-3">
        <p id="jumlah-lapangan" class="text-2xl font-bold">-</p>
        <p class="text-primary-100">lapangan tersedia</p>
      </div>

      <div class="bg-white/10 rounded-xl px-5 py-3">
        <p class="text-2xl font-bold">09.00 - 20.00</p>
        <p class="text-primary-100">jam operasional senin - jumat</p>
      </div>

      <div class="bg-white/10 rounded-xl px-5 py-3">
        <p class="text-2xl font-bold">12.00 - 17.00</p>
        <p class="text-primary-100">jam operasional sabtu</p>
      </div>

      <div class="bg-white/10 rounded-xl px-5 py-3">
        <p class="text-2xl font-bold">tutup</p>
        <p class="text-primary-100">setiap hari minggu</p>
      </div>
    </div>

    <a href="#katalog"
       class="inline-block mt-10 bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-primary-100 transition">
      Sewa Lapangan Sekarang ↓
    </a>
  </div>
</section>

<div class="max-w-6xl mx-auto px-4 py-8">

  <div id="katalog" class="mb-8">
    <h2 class="text-3xl font-bold text-gray-800">Pilih Lapangan</h2>

    <p class="text-gray-500 mt-1">
      pilih lapangan, tentukan jadwal, lalu konfirmasi langsung ke petugas dengan menunjukkan ktm kamu.
    </p>
  </div>

  <div id="lapangan-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <p class="text-gray-400 col-span-full">Memuat daftar lapangan...</p>
  </div>

</div>

<script>
// dikirim dari php lewat session, dipakai buat sembunyikan tombol sewa kalau yang login admin
const isAdminLogin = <?= isAdmin() ? 'true' : 'false' ?>;

// mengambil daftar lapangan dari api lalu merender jadi kartu-kartu
async function loadLapangan() {
  const res = await fetch('api/get_lapangan.php');
  const json = await res.json();
  const container = document.getElementById('lapangan-list');
  container.innerHTML = '';

  document.getElementById('jumlah-lapangan').textContent = json.data.length;

  if (!json.success || json.data.length === 0) {
    container.innerHTML = '<p class="text-gray-400 col-span-full">Belum ada lapangan tersedia.</p>';
    return;
  }

  json.data.forEach(lap => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col h-full';

    // admin/petugas cuma bertugas verifikasi ktm, jadi dia tidak dapat tombol sewa
    const tombolAksi = isAdminLogin
      ? `<span class="text-xs text-gray-400 italic">akun admin tidak bisa booking</span>`
      : `<a href="booking.php?id=${lap.id}" class="bg-primary-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-800">Sewa</a>`;

    // gambar  diambil dari kolom "gambar" di database (bukan lagi
    // dicocokkan lewat nama persis di javascript 
    //  taruh file png  di folder assets/img/lapangan/
    // lalu isi nama filenya di panel admin > kelola lapangan.
    // kalau kolom gambar kosong atau file-nya tidak ketemu
    const gambarHtml = lap.gambar
      ? `<img src="assets/img/lapangan/${lap.gambar}" alt="${lap.nama}" class="w-full h-40 object-cover bg-gray-200"
           onerror="this.outerHTML = '<div class=\\'h-40 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-4xl\\'>🏟️</div>'">`
      : `<div class="h-40 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-4xl">🏟️</div>`;

    card.innerHTML = `
      ${gambarHtml}
      <div class="p-5 flex-1 flex flex-col">
        <div>
          <span class="text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded-full">${lap.jenis}</span>
          <h3 class="text-lg font-bold text-gray-800 mt-3">${lap.nama}</h3>
          <p class="text-sm text-gray-500 mt-1">${lap.lokasi}</p>
          <p class="text-sm text-gray-400 mt-2">${lap.deskripsi ?? ''}</p>
        </div>
        <div class="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <span class="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">Gratis</span>
          ${tombolAksi}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}
loadLapangan();
</script>

<?php require_once 'includes/footer.php'; ?>

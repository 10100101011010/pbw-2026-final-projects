<?php
$root = '';
require_once 'includes/auth.php';
require_once 'includes/functions.php';
requireLogin($root);
$page_title = 'Riwayat Booking Saya';
require_once 'includes/header.php';
?>

<div class="max-w-6xl mx-auto px-4 py-8">

  <h1 class="text-2xl font-bold text-gray-800 mb-6">Riwayat Booking Saya</h1>

  <div id="daftar-booking" class="space-y-4">
    <p class="text-gray-400">Memuat riwayat booking...</p>
  </div>

</div>

<script>
const BADGE_CLASS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  expired: 'bg-gray-100 text-gray-500'
};
const STATUS_LABEL = {
  pending: 'Menunggu Konfirmasi',
  confirmed: 'Terkonfirmasi',
  cancelled: 'Dibatalkan',
  expired: 'Kadaluarsa'
};

async function loadRiwayat() {
  const res = await fetch('api/get_bookings.php');
  const json = await res.json();
  const container = document.getElementById('daftar-booking');
  container.innerHTML = '';

  if (!json.success || json.data.length === 0) {
    container.innerHTML = '<p class="text-gray-400">Kamu belum pernah booking lapangan.</p>';
    return;
  }

  json.data.forEach(b => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-wrap justify-between items-center gap-3';

    // catatan pembatalan cuma muncul kalau statusnya cancelled DAN memang ada
    // catatannya -- ini yang bikin mahasiswa tau kenapa booking-nya dibatalkan,
    // soalnya sekarang cuma admin yang bisa batalkan, jadi mahasiswa perlu
    // penjelasan kenapa (bukan cuma "dibatalkan" doang tanpa alasan)
    const catatanHtml = (b.status === 'cancelled' && b.catatan_pembatalan)
      ? `<p class="text-xs text-red-500 mt-1 italic">Alasan dibatalkan: ${b.catatan_pembatalan}</p>`
      : '';

    card.innerHTML = `
      <div>
        <p class="font-bold text-gray-800">${b.nama_lapangan}</p>
        <p class="text-sm text-gray-500">${b.tanggal} &middot; ${b.jam_mulai.slice(0,5)} - ${b.jam_selesai.slice(0,5)}</p>
        <p class="text-sm text-gray-400">Kode: <b class="text-primary-700">${b.kode_booking}</b></p>
        <p class="text-xs text-gray-400">No HP: ${b.no_hp ?? '-'}</p>
        ${catatanHtml}
      </div>
      <div class="text-right">
        <span class="text-xs font-medium px-3 py-1 rounded-full ${BADGE_CLASS[b.status]}">${STATUS_LABEL[b.status]}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

loadRiwayat();
</script>

<?php require_once 'includes/footer.php'; ?>
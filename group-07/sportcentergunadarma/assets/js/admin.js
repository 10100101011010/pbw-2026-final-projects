const formCekKode = document.getElementById('form-cek-kode');
const alertBox = document.getElementById('alert');
const detailBooking = document.getElementById('detail-booking');
const btnKonfirmasi = document.getElementById('btn-konfirmasi');
let bookingAktif = null; // menyimpan data booking yang sedang dicek, dipakai saat klik konfirmasi

// langkah 1: cek kode booking, tampilkan data mahasiswa (belum mengubah status)
if (formCekKode) {
  formCekKode.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formCekKode);

    const res = await fetch('../api/cek_kode.php', { method: 'POST', body: formData });
    const json = await res.json();

    alertBox.classList.remove('hidden');
    if (json.success) {
      // sudah waktunya, tombol konfirmasi aktif
      alertBox.classList.add('hidden');
      bookingAktif = json.data;
      tampilkanDetail(json.data, true);
    } else if (json.data) {
      // kode ketemu, tapi belum bisa dikonfirmasi (belum waktunya / sudah
      // confirmed / sudah cancelled) -- tetap tampilkan detailnya biar petugas
      // tau alasannya, tapi tombol konfirmasi disembunyikan
      alertBox.className = 'mb-4 p-3 rounded-lg text-sm bg-yellow-50 text-yellow-700';
      alertBox.textContent = json.message;
      bookingAktif = null;
      tampilkanDetail(json.data, false);
    } else {
      // kode tidak ditemukan sama sekali
      alertBox.className = 'mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700';
      alertBox.textContent = json.message;
      detailBooking.classList.add('hidden');
    }
  });
}

function tampilkanDetail(data, bisaKonfirmasi) {
  detailBooking.classList.remove('hidden');
  document.getElementById('detail-nama').textContent = `${data.nama} (${data.npm})`;
  document.getElementById('detail-jadwal').textContent =
    `${data.nama_lapangan} · ${data.tanggal} · ${data.jam_mulai.slice(0,5)} - ${data.jam_selesai.slice(0,5)}`;
  document.getElementById('detail-hp').textContent = data.no_hp || '-';
  btnKonfirmasi.classList.toggle('hidden', !bisaKonfirmasi);
}

// langkah 2: setelah petugas mencocokkan ktm secara manual, baru status diubah jadi confirmed
if (btnKonfirmasi) {
  btnKonfirmasi.addEventListener('click', async () => {
    if (!bookingAktif) return;
    const formData = new FormData();
    formData.append('booking_id', bookingAktif.id);

    const res = await fetch('../api/checkin.php', { method: 'POST', body: formData });
    const json = await res.json();

    alertBox.classList.remove('hidden');
    if (json.success) {
      alertBox.className = 'mb-4 p-3 rounded-lg text-sm bg-primary-50 text-primary-700';
      alertBox.textContent = json.message;
      detailBooking.classList.add('hidden');
      formCekKode.reset();
      bookingAktif = null;
      loadPending();
    } else {
      alertBox.className = 'mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700';
      alertBox.textContent = json.message;
    }
  });
}

// menampilkan daftar booking yang masih menunggu konfirmasi untuk hari ini
async function loadPending() {
  const container = document.getElementById('daftar-pending');
  if (!container) return;

  const res = await fetch('../api/get_bookings.php');
  const json = await res.json();
  container.innerHTML = '';

  const today = new Date().toISOString().split('T')[0];
  const pendingToday = (json.data || []).filter(b => b.status === 'pending' && b.tanggal === today);

  if (pendingToday.length === 0) {
    container.innerHTML = '<p class="text-gray-400">Tidak ada booking yang menunggu konfirmasi hari ini.</p>';
    return;
  }

  pendingToday.forEach(b => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl border border-gray-100 p-4 flex justify-between items-center';
    card.innerHTML = `
      <div>
        <p class="font-bold text-gray-800">${b.nama} <span class="text-gray-400 font-normal">(${b.npm})</span></p>
        <p class="text-sm text-gray-500">${b.nama_lapangan} · ${b.jam_mulai.slice(0,5)} - ${b.jam_selesai.slice(0,5)}</p>
      </div>
      <span class="text-sm font-bold text-primary-700 tracking-widest">${b.kode_booking}</span>
    `;
    container.appendChild(card);
  });
}

loadPending();

// ================== RIWAYAT SEMUA BOOKING ==================

const daftarRiwayat = document.getElementById('daftar-riwayat');
const tombolFilter = document.querySelectorAll('.filter-status');
const badgeBaru = document.getElementById('badge-baru');

let filterAktif = 'semua';
// nyimpen id booking terbesar yang pernah kelihatan, dipakai buat tau
// apakah ada booking baru masuk sejak polling terakhir
let idTerakhirDilihat = null;
let dataBookingTerakhir = [];

const LABEL_STATUS = {
  pending: 'Pending',
  confirmed: 'Terkonfirmasi',
  cancelled: 'Dibatalkan',
  expired: 'Kadaluarsa',
};
const WARNA_STATUS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  expired: 'bg-gray-100 text-gray-500',
};

// klik salah satu tombol filter, ganti tampilan tombol aktif lalu render ulang
tombolFilter.forEach(btn => {
  btn.addEventListener('click', () => {
    filterAktif = btn.dataset.filter;
    tombolFilter.forEach(b => b.className = 'filter-status bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg');
    btn.className = 'filter-status bg-primary-700 text-white px-3 py-1.5 rounded-lg';
    renderRiwayat(dataBookingTerakhir);
  });
});

// tombol batalkan ini FITUR BARU: admin bisa batalkan booking siapapun,
// beda dari tombol batal di riwayat.php mahasiswa (yang sekarang sudah
// dihapus -- cuma admin yang boleh batalkan booking sekarang)
async function batalkanOlehAdmin(id) {
  // pakai prompt(), bukan confirm() biasa, soalnya backend sekarang mewajibkan
  // catatan alasan pembatalan -- kalau dikosongkan/dibatalkan, prompt balikin
  // null atau string kosong, dan proses batal tidak dilanjutkan
  const catatan = prompt('tulis alasan pembatalan (wajib diisi, ini akan dilihat mahasiswa di riwayat booking-nya):');
  if (catatan === null) return; // admin batal ngisi (klik cancel di prompt)
  if (catatan.trim() === '') {
    alert('catatan pembatalan wajib diisi, tidak boleh kosong');
    return;
  }

  const formData = new FormData();
  formData.append('booking_id', id);
  formData.append('catatan_pembatalan', catatan.trim());
  const res = await fetch('../api/admin_batalkan_booking.php', { method: 'POST', body: formData });
  const json = await res.json();
  alert(json.message);
  if (json.success) {
    muatRiwayat();
  }
}

// render daftar booking ke layar sesuai filter status yang lagi aktif
function renderRiwayat(data) {
  if (!daftarRiwayat) return;
  dataBookingTerakhir = data;

  const hasilFilter = filterAktif === 'semua'
    ? data
    : data.filter(b => b.status === filterAktif);

  // urutkan dari yang paling baru dibuat, biar booking terbaru kelihatan paling atas
  const terurut = [...hasilFilter].sort((a, b) => b.id - a.id);

  daftarRiwayat.innerHTML = '';
  if (terurut.length === 0) {
    daftarRiwayat.innerHTML = '<p class="text-gray-400">Tidak ada data untuk filter ini.</p>';
    return;
  }

  terurut.forEach(b => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap justify-between items-center gap-2';

    // tombol batal cuma muncul kalau statusnya masih pending atau confirmed,
    // booking yang sudah cancelled/expired tidak perlu dibatalkan lagi
    const bisaDibatalkan = b.status === 'pending' || b.status === 'confirmed';
    const tombolBatal = bisaDibatalkan
      ? `<button onclick="batalkanOlehAdmin(${b.id})" class="text-xs text-red-600 hover:underline mt-1">Batalkan (admin)</button>`
      : '';

    card.innerHTML = `
      <div>
        <p class="font-bold text-gray-800">${b.nama} <span class="text-gray-400 font-normal">(${b.npm})</span></p>
        <p class="text-sm text-gray-500">${b.nama_lapangan} &middot; ${b.tanggal} &middot; ${b.jam_mulai.slice(0,5)}-${b.jam_selesai.slice(0,5)}</p>
        <p class="text-xs text-gray-400">Kode: ${b.kode_booking} &middot; HP: ${b.no_hp || '-'}</p>
      </div>
      <div class="text-right">
        <span class="text-xs font-medium px-3 py-1 rounded-full ${WARNA_STATUS[b.status] || ''}">${LABEL_STATUS[b.status] || b.status}</span>
        ${tombolBatal}
      </div>
    `;
    daftarRiwayat.appendChild(card);
  });
}

// ambil ulang seluruh data booking dari server. dipanggil pertama kali saat halaman
// dibuka, dan diulang otomatis tiap 15 detik lewat setInterval di bawah (polling,
// bukan notifikasi push beneran -- browser yang aktif nanya ke server, bukan
// server yang ngirim duluan)
async function muatRiwayat() {
  const res = await fetch('../api/get_bookings.php');
  const json = await res.json();
  const data = json.data || [];

  if (data.length > 0) {
    const idTertinggiSekarang = Math.max(...data.map(b => b.id));

    // baru dianggap "ada booking baru" kalau ini BUKAN pemuatan pertama kali
    // (idTerakhirDilihat belum null) dan ternyata ada id yang lebih besar dari sebelumnya
    if (idTerakhirDilihat !== null && idTertinggiSekarang > idTerakhirDilihat && badgeBaru) {
      badgeBaru.classList.remove('hidden');
    }
    idTerakhirDilihat = idTertinggiSekarang;
  }

  renderRiwayat(data);
  loadPending(); // sinkronkan juga daftar pending hari ini tiap polling
}

// klik area riwayat manapun otomatis mematikan badge "ada booking baru",
// dianggap admin sudah melihat data terbarunya
if (daftarRiwayat && badgeBaru) {
  daftarRiwayat.addEventListener('click', () => badgeBaru.classList.add('hidden'));
}

if (daftarRiwayat) {
  muatRiwayat();
  // polling tiap 15 detik -- angka ini bisa disesuaikan, jangan terlalu kecil
  // supaya tidak membebani server dengan request yang kebanyakan
  setInterval(muatRiwayat, 15000);
}

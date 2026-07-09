const inputTanggal = document.getElementById('input-tanggal');
const pilihJamMulai = document.getElementById('pilih-jam-mulai');
const pilihDurasi = document.getElementById('pilih-durasi');
const inputJamSelesai = document.getElementById('input-jam-selesai');
const inputNoHp = document.getElementById('input-no-hp');
const jadwalTerisi = document.getElementById('jadwal-terisi');
const infoJamOperasional = document.getElementById('info-jam-operasional');
const formBooking = document.getElementById('form-booking');
const hasilBooking = document.getElementById('hasil-booking');
const alertBox = document.getElementById('alert');

// nyimpen hasil terakhir dari api/get_jadwal.php buat tanggal yang lagi dipilih.
// SATU sumber data ini dipakai bareng-bareng oleh renderOpsiJamMulai() (buat
// dropdown) DAN tampilanJadwalTerisi() (buat pesan ringkasan di bawah durasi) --
// ini yang memperbaiki bug draft sebelumnya, di mana dua bagian itu ditulis
// terpisah dan bisa saling kontradiksi (dropdown bilang "waktu terlewat" tapi
// pesan ringkasan masih bilang "semua jam masih tersedia")
let jadwalHariIni = {
  libur: false,
  jam_buka: null,
  jam_tutup: null,
  jam_terisi: [],
  jam_sekarang: null,
  apakah_hari_ini: false,
};

// pecah "07:00" jadi jumlah menit dari tengah malam, biar gampang dibandingkan
function keMenit(jam) {
  const [h, m] = jam.split(':').map(Number);
  return h * 60 + m;
}

// kebalikan dari keMenit, ubah jumlah menit balik jadi format "07:00"
function keJam(menit) {
  const h = String(Math.floor(menit / 60)).padStart(2, '0');
  const m = String(menit % 60).padStart(2, '0');
  return `${h}:${m}`;
}

// cek apakah slot [mulai, selesai] bentrok sama salah satu jadwal yang sudah terisi
function apakahBentrok(mulaiMenit, selesaiMenit) {
  return jadwalHariIni.jam_terisi.some(j => {
    const jMulai = keMenit(j.jam_mulai.slice(0, 5));
    const jSelesai = keMenit(j.jam_selesai.slice(0, 5));
    return mulaiMenit < jSelesai && selesaiMenit > jMulai;
  });
}

// generate ulang opsi jam mulai, dipanggil tiap tanggal atau durasi berubah.
// tiap slot dicek 2 hal sebelum ditampilkan sebagai pilihan aktif:
// 1) apakah bentrok sama booking lain, 2) apakah sudah lewat jam sekarang
// (KHUSUS kalau tanggal yang dipilih = hari ini, dibandingkan pakai jam SERVER
// dari api/get_jadwal.php, bukan jam komputer/hp mahasiswa sendiri)
function renderOpsiJamMulai() {
  pilihJamMulai.innerHTML = '';

  if (jadwalHariIni.libur) {
    pilihJamMulai.innerHTML = '<option value="">sport center tutup hari minggu</option>';
    perbaruiJamSelesai();
    return;
  }

  const durasi = parseInt(pilihDurasi.value, 10) * 60; // ubah ke menit
  const batasBuka = keMenit(jadwalHariIni.jam_buka);
  const batasTutup = keMenit(jadwalHariIni.jam_tutup);
  const menitSekarang = jadwalHariIni.apakah_hari_ini ? keMenit(jadwalHariIni.jam_sekarang) : null;

  let adaSlotTersedia = false;

  // slot digenerate tiap 1 jam dari jam buka sampai jam tutup di TANGGAL INI
  for (let mulai = batasBuka; mulai + durasi <= batasTutup; mulai += 60) {
    const selesai = mulai + durasi;
    const bentrok = apakahBentrok(mulai, selesai);
    const sudahLewat = menitSekarang !== null && mulai <= menitSekarang;

    const opt = document.createElement('option');
    opt.value = keJam(mulai);

    if (bentrok) {
      opt.textContent = `${keJam(mulai)} - ${keJam(selesai)} (sudah terisi)`;
      opt.disabled = true;
    } else if (sudahLewat) {
      opt.textContent = `${keJam(mulai)} - ${keJam(selesai)} (waktu sudah lewat)`;
      opt.disabled = true;
    } else {
      opt.textContent = `${keJam(mulai)} - ${keJam(selesai)} (tersedia)`;
      adaSlotTersedia = true;
    }
    pilihJamMulai.appendChild(opt);
  }

  if (!adaSlotTersedia) {
    pilihJamMulai.innerHTML = '<option value="">tidak ada slot tersedia di durasi ini</option>';
  }

  perbaruiJamSelesai();
}

// jam_selesai itu turunan dari jam_mulai + durasi, dihitung otomatis
// tetap dikirim ke server sebagai field tersendiri biar validasi backend tidak perlu diubah
function perbaruiJamSelesai() {
  if (!pilihJamMulai.value) {
    inputJamSelesai.value = '';
    return;
  }
  const mulaiMenit = keMenit(pilihJamMulai.value);
  const durasiMenit = parseInt(pilihDurasi.value, 10) * 60;
  inputJamSelesai.value = keJam(mulaiMenit + durasiMenit);
}

// merender pesan ringkasan (jam operasional + jam yang sudah terisi) berdasarkan
// jadwalHariIni yang SAMA dipakai renderOpsiJamMulai() -- ini yang memperbaiki
// bug "semua jam di tanggal ini masih tersedia" padahal sudah lewat jam operasional:
// dulu pesan ini cuma mengecek jamTerisiHariIni.length, tidak pernah mengecek
// jam sekarang maupun jam operasional sama sekali
function tampilkanRingkasanJadwal() {
  if (jadwalHariIni.libur) {
    jadwalTerisi.innerHTML = '';
    infoJamOperasional.className = 'mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-600';
    infoJamOperasional.textContent = '🚫 sport center libur setiap hari minggu, silakan pilih tanggal lain';
    return;
  }

  infoJamOperasional.className = 'mb-4 p-3 rounded-lg text-sm bg-primary-50 text-primary-700';
  infoJamOperasional.textContent = `jam operasional tanggal ini: ${jadwalHariIni.jam_buka} - ${jadwalHariIni.jam_tutup}`;

  const adaJamTerisi = jadwalHariIni.jam_terisi.length > 0;
  const semuaSudahLewat = jadwalHariIni.apakah_hari_ini && jadwalHariIni.jam_sekarang >= jadwalHariIni.jam_tutup;

  if (semuaSudahLewat) {
    jadwalTerisi.innerHTML = '⛔ sudah lewat jam operasional hari ini, silakan pilih tanggal lain.';
  } else if (adaJamTerisi) {
    const daftar = jadwalHariIni.jam_terisi
      .map(j => `${j.jam_mulai.slice(0, 5)} - ${j.jam_selesai.slice(0, 5)}`)
      .join(', ');
    jadwalTerisi.innerHTML = `⚠️ Jam yang sudah dibooking di tanggal ini: <b>${daftar}</b>`;
  } else {
    jadwalTerisi.innerHTML = '✅ Semua jam di tanggal ini masih tersedia.';
  }
}

// setiap tanggal diganti, ambil jam operasional + jam yang sudah dibooking
// orang lain di tanggal itu SEKALIGUS dalam satu request (satu sumber data,
// dipakai bareng oleh dropdown & pesan ringkasan)
if (inputTanggal) {
  inputTanggal.addEventListener('change', async () => {
    const tanggal = inputTanggal.value;
    if (!tanggal) return;

    const res = await fetch(`api/get_jadwal.php?lapangan_id=${lapanganId}&tanggal=${tanggal}`);
    const json = await res.json();

    jadwalHariIni = json.success ? json.data : {
      libur: false, jam_buka: '09:00', jam_tutup: '20:00', jam_terisi: [],
      jam_sekarang: null, apakah_hari_ini: false,
    };

    tampilkanRingkasanJadwal();
    renderOpsiJamMulai();
  });
}

if (pilihDurasi) {
  pilihDurasi.addEventListener('change', renderOpsiJamMulai);
}
if (pilihJamMulai) {
  pilihJamMulai.addEventListener('change', perbaruiJamSelesai);
}

// submit form booking ke server -- SEBELUM benar-benar dikirim, tampilkan dulu
// dialog "anda yakin" biar mahasiswa tidak salah pencet jam/tanggal
if (formBooking) {
  formBooking.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!pilihJamMulai.value) {
      alertBox.classList.remove('hidden');
      alertBox.className = 'mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700';
      alertBox.textContent = 'pilih jam mulai yang masih tersedia dulu';
      return;
    }

    const tanggalDipilih = inputTanggal.value;
    const jamMulaiDipilih = pilihJamMulai.value;
    const jamSelesaiDipilih = inputJamSelesai.value;

    // dialog konfirmasi sebelum benar-benar submit ke server, sesuai permintaan:
    // "anda yakin untuk pesan ini di sini jam ini sampai jam ini?"
    const konfirmasi = confirm(
      `anda yakin untuk pesan ${namaLapangan} pada tanggal ${tanggalDipilih}, ` +
      `jam ${jamMulaiDipilih} sampai jam ${jamSelesaiDipilih}?`
    );
    if (!konfirmasi) {
      return; // mahasiswa membatalkan sendiri di dialog, tidak jadi kirim apapun ke server
    }

    const formData = new FormData(formBooking);

    const res = await fetch('api/booking.php', { method: 'POST', body: formData });
    const json = await res.json();

    alertBox.classList.remove('hidden');
    if (json.success) {
      // sembunyikan form, tampilkan kode booking hasil
      formBooking.classList.add('hidden');
      alertBox.classList.add('hidden');
      hasilBooking.classList.remove('hidden');
      document.getElementById('kode-booking').textContent = json.data.kode_booking;
    } else {
      alertBox.className = 'mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700';
      alertBox.textContent = json.message;
    }
  });
}

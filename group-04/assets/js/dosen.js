/* =========================================================
   SIKUT - dosen.js
   Menangani buat tugas, unggah materi, beri nilai, kirim pengingat
   ========================================================= */

// ---------- BUAT TUGAS BARU ----------
const formBuatTugas = document.getElementById('form-buat-tugas');
if (formBuatTugas) {
    formBuatTugas.addEventListener('submit', async function (e) {
        e.preventDefault();
        const tombol = formBuatTugas.querySelector('button[type="submit"]');
        tombol.disabled = true;
        tombol.textContent = 'Menyimpan...';

        try {
            const res = await fetch('api/dosen/create_tugas.php', {
                method: 'POST',
                body: new FormData(formBuatTugas)
            });
            const hasil = await res.json();
            if (hasil.success) {
                tampilkanToast(hasil.message, 'sukses');
                setTimeout(() => window.location.reload(), 800);
            } else {
                tampilkanToast(hasil.message, 'gagal');
            }
        } catch (err) {
            tampilkanToast('Koneksi ke server gagal.', 'gagal');
        }
        tombol.disabled = false;
        tombol.textContent = 'Simpan Tugas';
    });
}

// ---------- UNGGAH MATERI ----------
const formUnggahMateri = document.getElementById('form-unggah-materi');
if (formUnggahMateri) {
    formUnggahMateri.addEventListener('submit', async function (e) {
        e.preventDefault();
        const tombol = formUnggahMateri.querySelector('button[type="submit"]');
        tombol.disabled = true;
        tombol.textContent = 'Mengunggah...';

        try {
            const res = await fetch('api/dosen/upload_materi.php', {
                method: 'POST',
                body: new FormData(formUnggahMateri)
            });
            const hasil = await res.json();
            if (hasil.success) {
                tampilkanToast(hasil.message, 'sukses');
                setTimeout(() => window.location.reload(), 800);
            } else {
                tampilkanToast(hasil.message, 'gagal');
            }
        } catch (err) {
            tampilkanToast('Koneksi ke server gagal.', 'gagal');
        }
        tombol.disabled = false;
        tombol.textContent = 'Unggah';
    });
}

// ---------- SIMPAN NILAI ----------
document.querySelectorAll('.btn-simpan-nilai').forEach(function (tombol) {
    tombol.addEventListener('click', async function () {
        const pengumpulanId = tombol.dataset.pengumpulan;
        const inputNilai = document.querySelector('.input-nilai[data-pengumpulan="' + pengumpulanId + '"]');
        const nilai = inputNilai.value;

        if (nilai === '' || nilai < 0 || nilai > 100) {
            tampilkanToast('Nilai harus di antara 0 - 100.', 'gagal');
            return;
        }

        tombol.disabled = true;
        tombol.textContent = '...';

        try {
            const res = await fetch('api/dosen/beri_nilai.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'pengumpulan_id=' + encodeURIComponent(pengumpulanId) + '&nilai=' + encodeURIComponent(nilai)
            });
            const hasil = await res.json();
            tampilkanToast(hasil.message, hasil.success ? 'sukses' : 'gagal');
            if (hasil.success) {
                setTimeout(() => window.location.reload(), 700);
                return;
            }
        } catch (err) {
            tampilkanToast('Koneksi ke server gagal', 'gagal');
        }
        tombol.disabled = false;
        tombol.textContent = 'Simpan';
    });
});

// ---------- INGATKAN MAHASISWA ----------
document.querySelectorAll('.btn-ingatkan').forEach(function (tombol) {
    tombol.addEventListener('click', async function () {
        const mahasiswaId = tombol.dataset.mahasiswa;
        const matkulId = tombol.dataset.matkul;
        const judulTugas = tombol.dataset.judul;
        const pesan = "Jangan lupa kumpulkan tugas '" + judulTugas + "', tenggat waktunya sudah dekat!";

        tombol.disabled = true;
        tombol.textContent = 'Mengirim...';

        try {
            const res = await fetch('api/dosen/kirim_reminder.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'mahasiswa_id=' + encodeURIComponent(mahasiswaId) +
                      '&matkul_id=' + encodeURIComponent(matkulId) +
                      '&pesan=' + encodeURIComponent(pesan)
            });
            const hasil = await res.json();
            tampilkanToast(hasil.message, hasil.success ? 'sukses' : 'gagal');
            tombol.textContent = hasil.success ? '✔ Terkirim' : '🔔 Ingatkan';
        } catch (err) {
            tampilkanToast('Koneksi ke server gagal', 'gagal');
            tombol.textContent = '🔔 Ingatkan';
        }
        tombol.disabled = false;
    });
});

// ---------- HAPUS TUGAS ----------
document.querySelectorAll('.btn-hapus-tugas').forEach(function (tombol) {
    tombol.addEventListener('click', async function () {
        const tugasId = tombol.dataset.id;
        const judul = tombol.dataset.judul;

        const konfirmasi = confirm(
            'Hapus tugas "' + judul + '"?\n\n' +
            'Semua pengumpulan & nilai mahasiswa untuk tugas ini akan ikut terhapus permanen!'
        );
        if (!konfirmasi) return;

        tombol.disabled = true;
        tombol.textContent = 'Menghapus...';

        try {
            const res = await fetch('api/dosen/hapus_tugas.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'tugas_id=' + encodeURIComponent(tugasId)
            });
            const hasil = await res.json();
            tampilkanToast(hasil.message, hasil.success ? 'sukses' : 'gagal');
            if (hasil.success) {
                setTimeout(() => window.location.reload(), 700);
                return;
            }
        } catch (err) {
            tampilkanToast('Koneksi ke server gagal.', 'gagal');
        }
        tombol.disabled = false;
        tombol.textContent = '🗑️ Hapus';
    });
});
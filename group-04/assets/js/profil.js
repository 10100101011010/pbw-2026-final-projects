/* =========================================================
   SIKUT - profil.js
   Menangani update profil mahasiswa & dosen, termasuk toggle password
   ========================================================= */

document.querySelectorAll('.toggle-eye').forEach(function (tombol) {
    tombol.addEventListener('click', function () {
        const input = document.getElementById(tombol.dataset.target);
        if (input.type === 'password') {
            input.type = 'text';
            tombol.textContent = 'Sembunyikan';
        } else {
            input.type = 'password';
            tombol.textContent = 'Lihat';
        }
    });
});

// ---------- PREVIEW FOTO PROFIL SEBELUM DISIMPAN ----------
const inputFoto = document.getElementById('foto_profil');
if (inputFoto) {
    inputFoto.addEventListener('change', function () {
        const file = inputFoto.files[0];
        if (!file) return;

        const previewImg = document.getElementById('preview-foto');
        const previewKosong = document.getElementById('preview-foto-kosong');
        const infoFormat = document.getElementById('info-format-foto');

        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.classList.remove('hidden');
            if (previewKosong) previewKosong.classList.add('hidden');
            if (infoFormat) infoFormat.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    });
}

function tampilkanPesanProfil(tipe, teks) {
    const el = document.getElementById('pesan-box');
    if (!el) return;
    el.className = 'pesan-alert ' + tipe;
    el.textContent = teks;
    el.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const formProfilMhs = document.getElementById('form-profil-mahasiswa');
if (formProfilMhs) {
    formProfilMhs.addEventListener('submit', async function (e) {
        e.preventDefault();
        const tombol = formProfilMhs.querySelector('button[type="submit"]');
        tombol.disabled = true;
        tombol.textContent = 'Menyimpan...';

        try {
            const res = await fetch('api/mahasiswa/update_profil.php', {
                method: 'POST',
                body: new FormData(formProfilMhs)
            });
            const hasil = await res.json();
            tampilkanPesanProfil(hasil.success ? 'sukses' : 'gagal', hasil.message);
            if (hasil.success) {
                document.getElementById('password_baru').value = '';
                setTimeout(() => window.location.reload(), 900);
            }
        } catch (err) {
            tampilkanPesanProfil('gagal', 'Terjadi kesalahan koneksi ke server');
        }
        tombol.disabled = false;
        tombol.textContent = 'Simpan Perubahan';
    });
}

const formProfilDosen = document.getElementById('form-profil-dosen');
if (formProfilDosen) {
    formProfilDosen.addEventListener('submit', async function (e) {
        e.preventDefault();
        const tombol = formProfilDosen.querySelector('button[type="submit"]');
        tombol.disabled = true;
        tombol.textContent = 'Menyimpan...';

        try {
            const res = await fetch('api/dosen/update_profil.php', {
                method: 'POST',
                body: new FormData(formProfilDosen)
            });
            const hasil = await res.json();
            tampilkanPesanProfil(hasil.success ? 'sukses' : 'gagal', hasil.message);
            if (hasil.success) {
                document.getElementById('password_baru').value = '';
                setTimeout(() => window.location.reload(), 900);
            }
        } catch (err) {
            tampilkanPesanProfil('gagal', 'Terjadi kesalahan koneksi ke server');
        }
        tombol.disabled = false;
        tombol.textContent = 'Simpan Perubahan';
    });
}
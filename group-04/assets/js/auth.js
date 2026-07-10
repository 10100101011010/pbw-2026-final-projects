/* =========================================================
   SIKUT - auth.js
   Menangani submit form login & registrasi via fetch (API JSON)
   ========================================================= */

// Menampilkan / menyembunyikan password
function pasangTogglePassword() {
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
}

function tampilkanPesan(elemenId, tipe, teks) {
    const el = document.getElementById(elemenId);
    if (!el) return;
    el.className = 'pesan-alert ' + tipe;
    el.textContent = teks;
    el.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function pasangTombolLoading(tombol, teksLoading) {
    tombol.dataset.teksAsli = tombol.innerHTML;
    tombol.innerHTML = teksLoading;
    tombol.disabled = true;
}
function lepasTombolLoading(tombol) {
    tombol.innerHTML = tombol.dataset.teksAsli;
    tombol.disabled = false;
}

/* ---------------- LOGIN MAHASISWA ---------------- */
const formLoginMhs = document.getElementById('form-login-mahasiswa');
if (formLoginMhs) {
    formLoginMhs.addEventListener('submit', async function (e) {
        e.preventDefault();
        const tombol = formLoginMhs.querySelector('button[type="submit"]');
        pasangTombolLoading(tombol, 'Memproses...');

        try {
            const res = await fetch('api/auth/login_mahasiswa.php', {
                method: 'POST',
                body: new FormData(formLoginMhs)
            });
            const hasil = await res.json();
            if (hasil.success) {
                tampilkanPesan('pesan-box', 'sukses', hasil.message);
                window.location.href = hasil.redirect;
            } else {
                tampilkanPesan('pesan-box', 'gagal', hasil.message);
            }
        } catch (err) {
            tampilkanPesan('pesan-box', 'gagal', 'Terjadi kesalahan koneksi ke server');
        }
        lepasTombolLoading(tombol);
    });
}

/* ---------------- LOGIN DOSEN ---------------- */
const formLoginDosen = document.getElementById('form-login-dosen');
if (formLoginDosen) {
    formLoginDosen.addEventListener('submit', async function (e) {
        e.preventDefault();
        const tombol = formLoginDosen.querySelector('button[type="submit"]');
        pasangTombolLoading(tombol, 'Memproses...');

        try {
            const res = await fetch('api/auth/login_dosen.php', {
                method: 'POST',
                body: new FormData(formLoginDosen)
            });
            const hasil = await res.json();
            if (hasil.success) {
                tampilkanPesan('pesan-box', 'sukses', hasil.message);
                window.location.href = hasil.redirect;
            } else {
                tampilkanPesan('pesan-box', 'gagal', hasil.message);
            }
        } catch (err) {
            tampilkanPesan('pesan-box', 'gagal', 'Terjadi kesalahan koneksi ke server');
        }
        lepasTombolLoading(tombol);
    });
}

/* ---------------- REGISTER MAHASISWA ---------------- */
const formRegisterMhs = document.getElementById('form-register-mahasiswa');
if (formRegisterMhs) {
    formRegisterMhs.addEventListener('submit', async function (e) {
        e.preventDefault();

        const tombol = formRegisterMhs.querySelector('button[type="submit"]');
        pasangTombolLoading(tombol, 'Mendaftarkan...');

        try {
            const res = await fetch('api/auth/register_mahasiswa.php', {
                method: 'POST',
                body: new FormData(formRegisterMhs)
            });
            const hasil = await res.json();
            if (hasil.success) {
                tampilkanPesan('pesan-box', 'sukses', hasil.message + ' Mengalihkan ke halaman login...');
                setTimeout(() => window.location.href = 'login_mahasiswa.php', 1400);
            } else {
                tampilkanPesan('pesan-box', 'gagal', hasil.message);
            }
        } catch (err) {
            tampilkanPesan('pesan-box', 'gagal', 'Terjadi kesalahan koneksi ke server');
        }
        lepasTombolLoading(tombol);
    });
}

/* ---------------- REGISTER DOSEN ---------------- */
const formRegisterDosen = document.getElementById('form-register-dosen');
if (formRegisterDosen) {

    formRegisterDosen.addEventListener('submit', async function (e) {
        e.preventDefault();
        const tombol = formRegisterDosen.querySelector('button[type="submit"]');
        pasangTombolLoading(tombol, 'Mendaftarkan...');

        try {
            const res = await fetch('api/auth/register_dosen.php', {
                method: 'POST',
                body: new FormData(formRegisterDosen)
            });
            const hasil = await res.json();
            if (hasil.success) {
                tampilkanPesan('pesan-box', 'sukses', hasil.message + ' Mengalihkan ke halaman login...');
                setTimeout(() => window.location.href = 'login_dosen.php', 1400);
            } else {
                tampilkanPesan('pesan-box', 'gagal', hasil.message);
            }
        } catch (err) {
            tampilkanPesan('pesan-box', 'gagal', 'Terjadi kesalahan koneksi ke server');
        }
        lepasTombolLoading(tombol);
    });
}

pasangTogglePassword();

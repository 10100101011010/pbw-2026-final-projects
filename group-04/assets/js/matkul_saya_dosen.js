/* =========================================================
   SIKUT - matkul_saya_dosen.js
   Menangani tambah & berhenti ampu mata kuliah dari dashboard dosen
   ========================================================= */

// ---------- TAMBAH BARIS INPUT MATA KULIAH ----------
const wadahMatkulBaru = document.getElementById('wadah-matkul-diajar-baru');
const btnTambahBaris = document.getElementById('btn-tambah-baris-matkul');
let indexBaris = 1;

if (btnTambahBaris) {
    btnTambahBaris.addEventListener('click', function () {
        indexBaris++;
        const baris = document.createElement('div');
        baris.className = 'form-row mt-8 baris-matkul-diajar';
        baris.innerHTML = `
            <input type="text" name="nama_matkul[]" placeholder="Nama mata kuliah #${indexBaris}">
            <div style="display:flex; gap:8px;">
                <input type="text" name="kode_matkul[]" placeholder="Kode (cth: AI301)">
                <button type="button" class="btn-icon hapus-baris" title="Hapus">&times;</button>
            </div>
        `;
        wadahMatkulBaru.appendChild(baris);
        baris.querySelector('.hapus-baris').addEventListener('click', () => baris.remove());
    });
}

// ---------- SUBMIT TAMBAH MATA KULIAH ----------
const formTambahMatkulDosen = document.getElementById('form-tambah-matkul-dosen');
if (formTambahMatkulDosen) {
    formTambahMatkulDosen.addEventListener('submit', async function (e) {
        e.preventDefault();
        const tombol = formTambahMatkulDosen.querySelector('button[type="submit"]');
        tombol.disabled = true;
        tombol.textContent = 'Menyimpan...';

        try {
            const res = await fetch('api/dosen/tambah_matkul.php', {
                method: 'POST',
                body: new FormData(formTambahMatkulDosen)
            });
            const hasil = await res.json();
            if (hasil.success) {
                tampilkanToast(hasil.message, 'sukses');
                setTimeout(() => window.location.reload(), 700);
            } else {
                tampilkanToast(hasil.message, 'gagal');
            }
        } catch (err) {
            tampilkanToast('Koneksi ke server gagal', 'gagal');
        }
        tombol.disabled = false;
        tombol.textContent = 'Simpan Mata Kuliah';
    });
}

// ---------- BERHENTI AMPU MATA KULIAH ----------
document.querySelectorAll('.btn-hapus-matkul-dosen').forEach(function (tombol) {
    tombol.addEventListener('click', async function () {
        const namaMatkul = tombol.dataset.nama;
        if (!confirm('Berhenti mengampu "' + namaMatkul + '"?\n\nTugas, materi, dan data mahasiswa yang sudah ada tetap aman tersimpan, hanya mata kuliah ini tidak akan tampil lagi di dashboard Anda')) {
            return;
        }

        const matkulId = tombol.dataset.matkul;
        tombol.disabled = true;
        tombol.textContent = 'Memproses...';

        try {
            const res = await fetch('api/dosen/hapus_matkul.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'matkul_id=' + encodeURIComponent(matkulId)
            });
            const hasil = await res.json();
            if (hasil.success) {
                tampilkanToast(hasil.message, 'sukses');
                setTimeout(() => window.location.reload(), 600);
            } else {
                tampilkanToast(hasil.message, 'gagal');
                tombol.disabled = false;
                tombol.textContent = 'Berhenti Ampu';
            }
        } catch (err) {
            tampilkanToast('Koneksi ke server gagal.', 'gagal');
            tombol.disabled = false;
            tombol.textContent = 'Berhenti Ampu';
        }
    });
});

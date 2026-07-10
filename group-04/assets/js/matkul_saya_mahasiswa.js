/* =========================================================
   SIKUT - matkul_saya_mahasiswa.js
   Menangani tambah & hapus mata kuliah dari halaman "Mata Kuliah Saya"
   ========================================================= */

const formTambahMatkul = document.getElementById('form-tambah-matkul-mhs');
if (formTambahMatkul) {
    formTambahMatkul.addEventListener('submit', async function (e) {
        e.preventDefault();

        const dicentang = formTambahMatkul.querySelectorAll('input[name="matkul[]"]:checked');
        if (dicentang.length === 0) {
            tampilkanToast('Pilih minimal satu mata kuliah dulu!', 'gagal');
            return;
        }

        const tombol = formTambahMatkul.querySelector('button[type="submit"]');
        tombol.disabled = true;
        tombol.textContent = 'Menambahkan...';

        try {
            const res = await fetch('api/mahasiswa/tambah_matkul.php', {
                method: 'POST',
                body: new FormData(formTambahMatkul)
            });
            const hasil = await res.json();
            if (hasil.success) {
                tampilkanToast(hasil.message, 'sukses');
                setTimeout(() => window.location.reload(), 700);
            } else {
                tampilkanToast(hasil.message, 'gagal');
            }
        } catch (err) {
            tampilkanToast('Koneksi ke server gagal.', 'gagal');
        }
        tombol.disabled = false;
        tombol.textContent = '+ Tambahkan Mata Kuliah Terpilih';
    });
}

document.querySelectorAll('.btn-hapus-matkul').forEach(function (tombol) {
    tombol.addEventListener('click', async function () {
        const namaMatkul = tombol.dataset.nama;
        if (!confirm('Hapus "' + namaMatkul + '" dari daftar mata kuliahmu?\n\nTugas & nilai yang sudah ada tetap aman tersimpan, hanya tidak akan tampil lagi di dashboard')) {
            return;
        }

        const matkulId = tombol.dataset.matkul;
        tombol.disabled = true;
        tombol.textContent = 'Menghapus...';

        try {
            const res = await fetch('api/mahasiswa/hapus_matkul.php', {
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
                tombol.textContent = 'Hapus';
            }
        } catch (err) {
            tampilkanToast('Koneksi ke server gagal.', 'gagal');
            tombol.disabled = false;
            tombol.textContent = 'Hapus';
        }
    });
});

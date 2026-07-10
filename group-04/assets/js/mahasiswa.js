/* =========================================================
   SIKUT - mahasiswa.js
   Menangani checklist to-do pribadi & pengumpulan tugas
   ========================================================= */

// ---------- CHECKLIST TO-DO PRIBADI ----------
document.querySelectorAll('.cek-checklist').forEach(function (checkbox) {
    checkbox.addEventListener('change', async function () {
        const tugasId = checkbox.dataset.tugas;
        const wadah = checkbox.closest('.todo-check');
        const teks = wadah.querySelector('.teks-checklist');

        checkbox.disabled = true;
        try {
            const res = await fetch('api/mahasiswa/toggle_checklist.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'tugas_id=' + encodeURIComponent(tugasId)
            });
            const hasil = await res.json();

            if (hasil.success) {
                if (hasil.selesai) {
                    wadah.classList.add('selesai');
                    teks.textContent = 'Sudah aku kerjakan ✓';
                } else {
                    wadah.classList.remove('selesai');
                    teks.textContent = 'Tandai sudah dikerjakan';
                }
            } else {
                checkbox.checked = !checkbox.checked;
                tampilkanToast(hasil.message || 'Gagal memperbarui checklist.', 'gagal');
            }
        } catch (err) {
            checkbox.checked = !checkbox.checked;
            tampilkanToast('Koneksi ke server gagal.', 'gagal');
        }
        checkbox.disabled = false;
    });
});

// ---------- MODAL KUMPUL TUGAS ----------
document.querySelectorAll('.btn-kumpul').forEach(function (tombol) {
    tombol.addEventListener('click', function () {
        document.getElementById('input-tugas-id').value = tombol.dataset.id;
        document.getElementById('modal-judul-tugas').textContent = tombol.dataset.judul;
        bukaModal('modal-kumpul');
    });
});

const btnBatalKumpul = document.getElementById('btn-batal-kumpul');
if (btnBatalKumpul) {
    btnBatalKumpul.addEventListener('click', function () {
        tutupModal('modal-kumpul');
    });
}

const formKumpulTugas = document.getElementById('form-kumpul-tugas');
if (formKumpulTugas) {
    formKumpulTugas.addEventListener('submit', async function (e) {
        e.preventDefault();
        const form = e.target;
        const tombol = form.querySelector('button[type="submit"]');
        tombol.disabled = true;
        tombol.textContent = 'Mengunggah...';

        try {
            const res = await fetch('api/mahasiswa/submit_tugas.php', {
                method: 'POST',
                body: new FormData(form)
            });
            const hasil = await res.json();

            if (hasil.success) {
                tampilkanToast(hasil.message, 'sukses');
                setTimeout(() => window.location.reload(), 900);
            } else {
                tampilkanToast(hasil.message, 'gagal');
            }
        } catch (err) {
            tampilkanToast('Koneksi ke server gagal.', 'gagal');
        }
        tombol.disabled = false;
        tombol.textContent = 'Kumpulkan';
    });
}

// ---------- TO-DO LIST PRIBADI ----------
const formTambahTodo = document.getElementById('form-tambah-todo');
if (formTambahTodo) {
    formTambahTodo.addEventListener('submit', async function (e) {
        e.preventDefault();
        const tombol = formTambahTodo.querySelector('button[type="submit"]');
        tombol.disabled = true;
        tombol.textContent = 'Menyimpan...';

        try {
            const res = await fetch('api/mahasiswa/tambah_todo.php', {
                method: 'POST',
                body: new FormData(formTambahTodo)
            });
            const hasil = await res.json();
            if (hasil.success) {
                tampilkanToast(hasil.message, 'sukses');
                setTimeout(() => window.location.reload(), 600);
            } else {
                tampilkanToast(hasil.message, 'gagal');
            }
        } catch (err) {
            tampilkanToast('Koneksi ke server gagal', 'gagal');
        }
        tombol.disabled = false;
        tombol.textContent = '+ Tambah Catatan';
    });
}

document.querySelectorAll('.cek-todo').forEach(function (checkbox) {
    checkbox.addEventListener('change', async function () {
        const todoId = checkbox.dataset.todo;
        checkbox.disabled = true;
        try {
            const res = await fetch('api/mahasiswa/toggle_todo.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'todo_id=' + encodeURIComponent(todoId)
            });
            const hasil = await res.json();
            if (hasil.success) {
                setTimeout(() => window.location.reload(), 300);
            } else {
                checkbox.checked = !checkbox.checked;
                tampilkanToast(hasil.message || 'Gagal memperbarui catatan', 'gagal');
                checkbox.disabled = false;
            }
        } catch (err) {
            checkbox.checked = !checkbox.checked;
            tampilkanToast('Koneksi ke server gagal', 'gagal');
            checkbox.disabled = false;
        }
    });
});

document.querySelectorAll('.btn-hapus-todo').forEach(function (tombol) {
    tombol.addEventListener('click', async function () {
        if (!confirm('Hapus catatan ini?')) return;
        const todoId = tombol.dataset.todo;
        try {
            const res = await fetch('api/mahasiswa/hapus_todo.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'todo_id=' + encodeURIComponent(todoId)
            });
            const hasil = await res.json();
            if (hasil.success) {
                tombol.closest('.kartu-todo-pribadi').remove();
            } else {
                tampilkanToast(hasil.message || 'Gagal menghapus catatan', 'gagal');
            }
        } catch (err) {
            tampilkanToast('Koneksi ke server gagal', 'gagal');
        }
    });
});

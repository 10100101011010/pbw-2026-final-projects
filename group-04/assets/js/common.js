/* =========================================================
   SIKUT - common.js
   Fungsi umum: tab switching, toast, buka/tutup modal
   ========================================================= */

// ---------- TAB SWITCHING ----------
document.querySelectorAll('.tab-btn').forEach(function (tombol) {
    tombol.addEventListener('click', function () {
        const target = tombol.dataset.tab;

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('aktif'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('aktif'));

        tombol.classList.add('aktif');
        document.getElementById(target).classList.add('aktif');
    });
});

// ---------- TOAST ----------
function tampilkanToast(pesan, tipe = 'sukses') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = pesan;
    toast.className = 'toast tampil ' + tipe;
    setTimeout(() => {
        toast.classList.remove('tampil');
    }, 3200);
}

// ---------- BUKA / TUTUP MODAL ----------
function bukaModal(idModal) {
    document.getElementById(idModal).classList.add('aktif');
}
function tutupModal(idModal) {
    document.getElementById(idModal).classList.remove('aktif');
}

// Tutup modal jika klik area gelap di luar box
document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) overlay.classList.remove('aktif');
    });
});

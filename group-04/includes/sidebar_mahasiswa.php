<?php
// Partial ini di-include di halaman-halaman mahasiswa.
// Variabel $halamanAktif (opsional) menentukan menu mana yang disorot.
$halamanAktif = $halamanAktif ?? '';
?>
<div class="sidebar">
    <div class="brand">
        <span class="logo-kotak">🎓</span>
        SIKUT
    </div>

    <a href="profil_mahasiswa.php" class="sidebar-profil sidebar-profil-klik">
        <?php if (!empty($_SESSION['mahasiswa_foto'])): ?>
            <img src="<?= htmlspecialchars($_SESSION['mahasiswa_foto']) ?>" alt="Foto Profil" class="avatar-foto">
        <?php else: ?>
            <div class="avatar-inisial-bulat"><?= strtoupper(substr($_SESSION['mahasiswa_nama'] ?? '?', 0, 1)) ?></div>
        <?php endif; ?>
        <div>
            <div class="nama"><?= htmlspecialchars($_SESSION['mahasiswa_nama'] ?? '') ?></div>
            <div class="info">NPM: <?= htmlspecialchars($_SESSION['mahasiswa_npm'] ?? '') ?></div>
        </div>
    </a>

    <div class="sidebar-nav">
        <a href="dashboard_mahasiswa.php" class="<?= $halamanAktif === 'dashboard' ? 'aktif' : '' ?>">Dashboard</a>
        <a href="matkul_saya_mahasiswa.php" class="<?= $halamanAktif === 'matkul-saya' ? 'aktif' : '' ?>">Mata Kuliah</a>
        <a href="profil_mahasiswa.php" class="<?= $halamanAktif === 'profil' ? 'aktif' : '' ?>">Profil</a>
    </div>

    <a href="logout.php" class="sidebar-logout">🚪 Keluar</a>
</div>
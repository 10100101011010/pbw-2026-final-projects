<?php
$halamanAktif = $halamanAktif ?? '';
?>
<div class="sidebar">
    <div class="brand">
        <span class="logo-kotak">🎓</span>
        SIKUT
    </div>

    <a href="profil_dosen.php" class="sidebar-profil sidebar-profil-klik">
        <?php if (!empty($_SESSION['dosen_foto'])): ?>
            <img src="<?= htmlspecialchars($_SESSION['dosen_foto']) ?>" alt="Foto Profil" class="avatar-foto">
        <?php else: ?>
            <div class="avatar-inisial-bulat"><?= strtoupper(substr($_SESSION['dosen_nama'] ?? '?', 0, 1)) ?></div>
        <?php endif; ?>
        <div>
            <div class="nama"><?= htmlspecialchars($_SESSION['dosen_nama'] ?? '') ?></div>
            <div class="info">NIP: <?= htmlspecialchars($_SESSION['dosen_nip'] ?? '') ?></div>
        </div>
    </a>

    <div class="sidebar-nav">
        <a href="dashboard_dosen.php" class="<?= $halamanAktif === 'dashboard' ? 'aktif' : '' ?>">Dashboard</a>
        <a href="matkul_saya_dosen.php" class="<?= $halamanAktif === 'matkul-saya' ? 'aktif' : '' ?>">Mata Kuliah</a>
        <a href="profil_dosen.php" class="<?= $halamanAktif === 'profil' ? 'aktif' : '' ?>">Profil</a>
    </div>

    <a href="logout.php" class="sidebar-logout">🚪 Keluar</a>
</div>
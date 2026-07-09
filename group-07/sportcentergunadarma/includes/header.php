<?php
/**
 * navbar/header bersama untuk semua halaman.
 * $root harus di-set sebelum require file ini:
 *  - $root = ''    -> untuk halaman di folder root (index.php, login.php, dst)
 *  - $root = '../' -> untuk halaman di dalam folder admin/
 *
 *
 * lapisan: presentation
 */
if (!isset($root)) {
    $root = '';
}
if (!isset($page_title)) {
    $page_title = 'Sport Center Gunadarma';
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= htmlspecialchars($page_title) ?></title>
<!-- tailwind css via cdn, tanpa perlu build tools -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  // daftarin warna ungu kampus supaya bisa dipakai kayak bg-primary-700, text-primary-700, dst
  // 773b96 itu warna utama yang diminta, angka lain cuma variasi lebih terang/gelap
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f4edfb',
            100: '#e6d6f2',
            600: '#8a4bab',
            700: '#773b96',
            800: '#5f2f79',
            900: '#4a2560',
          },
        },
      },
    },
  };
</script>
</head>
<body class="bg-gray-50 min-h-screen flex flex-col">

<nav class="bg-primary-700 text-white shadow-md sticky top-0 z-20">
  <div class="max-w-6xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
    <a href="<?= $root ?>index.php" class="flex items-center gap-2 font-bold tracking-wide">
      <img src="<?= $root ?>assets/img/logo_gundar.png" alt="Logo Gunadarma" class="w-12 h-12 object-contain">
      <span>Sport Center Gunadarma</span>
    </a>
    <div class="flex items-center gap-4 text-sm flex-wrap">
      <a href="<?= $root ?>index.php" class="hover:text-primary-100">Lapangan</a>
      <?php if (isLoggedIn()): ?>
        <?php if (!isAdmin()): ?>
          <a href="<?= $root ?>riwayat.php" class="hover:text-primary-100">Riwayat Saya</a>
        <?php endif; ?>
        <?php if (isAdmin()): ?>
          <a href="<?= $root ?>admin/dashboard.php" class="hover:text-primary-100">Panel Admin</a>
        <?php endif; ?>
        <span class="text-primary-100">Hai, <?= htmlspecialchars($_SESSION['nama']) ?></span>
        <a href="<?= $root ?>logout.php" class="bg-primary-900 px-3 py-1.5 rounded-lg hover:bg-primary-800">Keluar</a>
      <?php else: ?>
        <a href="<?= $root ?>login.php" class="hover:text-primary-100">Masuk</a>
        <a href="<?= $root ?>register.php" class="bg-white text-primary-700 px-3 py-1.5 rounded-lg font-medium hover:bg-primary-100">Daftar</a>
      <?php endif; ?>
    </div>
  </div>
</nav>

<!-- perhatikan: tag <main> ini cuma dibuka SATU KALI, ditutup SATU KALI di footer.php,
     tidak pernah ditutup/dibuka lagi di tengah halaman manapun -->
<main class="flex-1">

<?php
$root = '../';
require_once '../includes/auth.php';
require_once '../config/database.php';
require_once '../includes/functions.php';
requireAdmin($root);

$db = (new Database())->getConnection();
$total = $db->query("SELECT COUNT(*) FROM booking")->fetchColumn();

$hariIni = $db->prepare("SELECT COUNT(*) FROM booking WHERE tanggal = ?");
$hariIni->execute([date('Y-m-d')]);
$totalHariIni = $hariIni->fetchColumn();

$pending = $db->query("SELECT COUNT(*) FROM booking WHERE status = 'pending'")->fetchColumn();
$confirmed = $db->query("SELECT COUNT(*) FROM booking WHERE status = 'confirmed'")->fetchColumn();

$page_title = 'Panel Admin - Dashboard';
require_once '../includes/header.php';
?>

<div class="max-w-6xl mx-auto px-4 py-8">

  <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <p class="text-sm text-gray-500">Total Booking</p>
      <p class="text-2xl font-bold text-gray-800"><?= $total ?></p>
    </div>
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <p class="text-sm text-gray-500">Booking Hari Ini</p>
      <p class="text-2xl font-bold text-gray-800"><?= $totalHariIni ?></p>
    </div>
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <p class="text-sm text-gray-500">Menunggu Konfirmasi</p>
      <p class="text-2xl font-bold text-yellow-600"><?= $pending ?></p>
    </div>
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <p class="text-sm text-gray-500">Terkonfirmasi</p>
      <p class="text-2xl font-bold text-green-600"><?= $confirmed ?></p>
    </div>
  </div>

  <div class="flex flex-wrap gap-4">
    <a href="konfirmasi.php" class="bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-800">Konfirmasi Kedatangan (Cek KTM)</a>
    <a href="kelola_lapangan.php" class="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300">Kelola Lapangan</a>
  </div>

</div>

<?php require_once '../includes/footer.php'; ?>
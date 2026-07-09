<?php
$root = '';
require_once 'includes/auth.php';
require_once 'includes/functions.php';
if (isLoggedIn()) {
    header('Location: index.php');
    exit();
}
$page_title = 'Daftar Akun';
require_once 'includes/header.php';
?>

<div class="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
  <h1 class="text-2xl font-bold text-gray-800 mb-1">Daftar Akun</h1>
  <p class="text-gray-500 text-sm mb-6">Gunakan NPM aktif kamu untuk mendaftar.</p>

  <div id="alert" class="hidden mb-4 p-3 rounded-lg text-sm"></div>

  <form id="form-register" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">NPM</label>
      <input type="text" name="npm" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
      <input type="text" name="nama" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input type="email" name="email" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <input type="password" name="password" required minlength="6" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
      <input type="password" name="konfirmasi_password" required minlength="6" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
    </div>
    <button type="submit" class="w-full bg-primary-700 text-white py-2.5 rounded-lg font-medium hover:bg-primary-800">Daftar</button>
  </form>

  <p class="text-sm text-gray-500 mt-4 text-center">Sudah punya akun? <a href="login.php" class="text-primary-700 font-medium">Masuk</a></p>
</div>

<script src="assets/js/auth.js"></script>
<?php require_once 'includes/footer.php'; ?>

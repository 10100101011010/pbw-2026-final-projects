<?php
$root = '../';
require_once '../includes/auth.php';
require_once '../config/database.php';
require_once '../includes/functions.php';
requireAdmin($root);

$db = (new Database())->getConnection();

// 1. proses tambah lapangan baru
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['tambah'])) {
    $stmt = $db->prepare(
        "INSERT INTO lapangan (nama, jenis, lokasi, deskripsi, gambar) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        sanitize($_POST['nama']),
        sanitize($_POST['jenis']),
        sanitize($_POST['lokasi']),
        sanitize($_POST['deskripsi']),
        sanitize($_POST['gambar']) ?: null,
    ]);
    header('Location: kelola_lapangan.php');
    exit();
}

// 2. proses simpan perubahan (edit)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update'])) {
    $stmt = $db->prepare(
        "UPDATE lapangan SET nama = ?, jenis = ?, lokasi = ?, deskripsi = ?, gambar = ? WHERE id = ?"
    );
    $stmt->execute([
        sanitize($_POST['nama']),
        sanitize($_POST['jenis']),
        sanitize($_POST['lokasi']),
        sanitize($_POST['deskripsi']),
        sanitize($_POST['gambar']) ?: null,
        (int) $_POST['id'],
    ]);
    header('Location: kelola_lapangan.php');
    exit();
}

// 3. proses menonaktifkan lapangan (bukan dihapus, supaya riwayat booking lama tetap utuh)
if (isset($_GET['nonaktifkan'])) {
    $stmt = $db->prepare("UPDATE lapangan SET status = 'nonaktif' WHERE id = ?");
    $stmt->execute([(int) $_GET['nonaktifkan']]);
    header('Location: kelola_lapangan.php');
    exit();
}

// 4. proses mengaktifkan kembali lapangan
if (isset($_GET['aktifkan'])) {
    $stmt = $db->prepare("UPDATE lapangan SET status = 'aktif' WHERE id = ?");
    $stmt->execute([(int) $_GET['aktifkan']]);
    header('Location: kelola_lapangan.php');
    exit();
}

// 5. ambil data spesifik kalau sedang dalam mode edit
$editData = null;
if (isset($_GET['edit'])) {
    $stmt = $db->prepare("SELECT * FROM lapangan WHERE id = ?");
    $stmt->execute([(int) $_GET['edit']]);
    $editData = $stmt->fetch(PDO::FETCH_ASSOC);
}

// ambil semua daftar lapangan untuk ditampilkan di bawah
$lapangan = $db->query("SELECT * FROM lapangan ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);

$page_title = 'Kelola Lapangan';
require_once '../includes/header.php';
?>

<div class="max-w-6xl mx-auto px-4 py-8">

  <h1 class="text-2xl font-bold text-gray-800 mb-6">Kelola Lapangan</h1>

  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
    <h2 class="font-bold text-gray-800 mb-4"><?= $editData ? 'Edit Data Lapangan' : 'Tambah Lapangan Baru' ?></h2>

    <form method="POST" action="kelola_lapangan.php" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <?php if ($editData): ?>
          <input type="hidden" name="id" value="<?= $editData['id'] ?>">
      <?php endif; ?>

      <input type="text" name="nama" placeholder="Nama lapangan" required class="border border-gray-300 rounded-lg px-3 py-2" value="<?= $editData ? htmlspecialchars($editData['nama']) : '' ?>">

      <input type="text" name="jenis" placeholder="Jenis (Futsal/Basket/dll)" required class="border border-gray-300 rounded-lg px-3 py-2" value="<?= $editData ? htmlspecialchars($editData['jenis']) : '' ?>">

      <input type="text" name="lokasi" placeholder="Lokasi" required class="border border-gray-300 rounded-lg px-3 py-2" value="<?= $editData ? htmlspecialchars($editData['lokasi']) : '' ?>">

      <input type="text" name="gambar" placeholder="Nama file gambar (contoh: futsal-a.png), boleh kosong" class="border border-gray-300 rounded-lg px-3 py-2" value="<?= $editData ? htmlspecialchars($editData['gambar'] ?? '') : '' ?>">

      <textarea name="deskripsi" placeholder="Deskripsi singkat" class="border border-gray-300 rounded-lg px-3 py-2 md:col-span-2"><?= $editData ? htmlspecialchars($editData['deskripsi']) : '' ?></textarea>

      <div class="md:col-span-2 flex gap-3">
          <button type="submit" name="<?= $editData ? 'update' : 'tambah' ?>" class="bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-800 flex-1">
              <?= $editData ? 'Simpan Perubahan' : 'Tambah Lapangan' ?>
          </button>
          <?php if ($editData): ?>
              <a href="kelola_lapangan.php" class="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300 flex items-center justify-center">Batal</a>
          <?php endif; ?>
      </div>
    </form>
  </div>

  <h2 class="font-bold text-gray-800 mb-4">Daftar Lapangan</h2>
  <div class="space-y-3">
    <?php foreach ($lapangan as $l): ?>
      <div class="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap justify-between items-center gap-3">
        <div>
          <p class="font-bold text-gray-800"><?= htmlspecialchars($l['nama']) ?> <span class="text-xs text-gray-400">(<?= htmlspecialchars($l['jenis']) ?>)</span></p>
          <p class="text-sm text-gray-500"><?= htmlspecialchars($l['lokasi']) ?> &middot; gratis <?= $l['gambar'] ? '&middot; gambar: ' . htmlspecialchars($l['gambar']) : '&middot; belum ada gambar' ?></p>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-xs px-3 py-1 rounded-full <?= $l['status'] === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500' ?>"><?= $l['status'] ?></span>

          <a href="?edit=<?= $l['id'] ?>" class="text-xs font-semibold text-blue-600 hover:underline">Edit</a>

          <?php if ($l['status'] === 'aktif'): ?>
            <a href="?nonaktifkan=<?= $l['id'] ?>" onclick="return confirm('Nonaktifkan lapangan ini?')" class="text-xs font-semibold text-red-600 hover:underline">Nonaktifkan</a>
          <?php else: ?>
            <a href="?aktifkan=<?= $l['id'] ?>" class="text-xs font-semibold text-green-600 hover:underline">Aktifkan</a>
          <?php endif; ?>
        </div>
      </div>
    <?php endforeach; ?>
  </div>

</div>

<?php require_once '../includes/footer.php'; ?>
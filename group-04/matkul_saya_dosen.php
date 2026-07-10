<?php
require_once __DIR__ . '/includes/functions.php';
requireDosen();

$pdo = getKoneksi();
$dosenId = $_SESSION['dosen_id'];

$stmt = $pdo->prepare("
    SELECT mk.*, (SELECT COUNT(*) FROM mahasiswa_matkul mm WHERE mm.matkul_id = mk.id) AS jumlah_mahasiswa
    FROM matakuliah mk WHERE mk.dosen_id = ? ORDER BY mk.nama_matkul ASC
");
$stmt->execute([$dosenId]);
$daftarMatkul = $stmt->fetchAll();

$halamanAktif = 'matkul-saya';
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mata Kuliah Saya</title>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/includes/sidebar_dosen.php'; ?>

    <div class="main-area">
        <div class="topbar">
            <h1>Mata Kuliah Saya</h1>
        </div>

        <div class="page-content">
            <?php if (($_GET['alasan'] ?? '') === 'wajib'): ?>
                <div class="pesan-alert gagal">
                    Anda belum mengampu mata kuliah apapun! Tambahkan minimal 1 mata kuliah di bawah!
                </div>
            <?php endif; ?>

            <h2 style="font-size:16px; margin-bottom:14px;">Mata Kuliah yang Diampu</h2>

            <?php if (empty($daftarMatkul)): ?>
                <div class="state-kosong">
                    <div class="emoji">🗂️</div>
                    <p>Kamu belum mengampu mata kuliah apapun! Tambahkan di bawah</p>
                </div>
            <?php else: ?>
                <div class="tabel-wrap mt-8">
                    <table>
                        <thead>
                            <tr>
                                <th>Kode</th>
                                <th>Mata Kuliah</th>
                                <th>SKS</th>
                                <th>Mahasiswa Terdaftar</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($daftarMatkul as $mk): ?>
                            <tr>
                                <td><span class="badge badge-ungu"><?= htmlspecialchars($mk['kode_matkul']) ?></span></td>
                                <td><?= htmlspecialchars($mk['nama_matkul']) ?></td>
                                <td><?= (int) $mk['sks'] ?></td>
                                <td><?= (int) $mk['jumlah_mahasiswa'] ?> mahasiswa</td>
                                <td>
                                    <button class="btn btn-outline btn-kecil btn-hapus-matkul-dosen" data-matkul="<?= $mk['id'] ?>" data-nama="<?= htmlspecialchars($mk['nama_matkul']) ?>">
                                        Berhenti Ampu
                                    </button>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>

            <div class="divider"></div>

            <div class="flex-between" style="margin-bottom:14px;">
                <h2 style="font-size:16px;">Tambah Mata Kuliah Baru</h2>
            </div>

            <form id="form-tambah-matkul-dosen">
                <div id="wadah-matkul-diajar-baru">
                    <div class="form-row baris-matkul-diajar">
                        <input type="text" name="nama_matkul[]" placeholder="Nama mata kuliah (cth: Kecerdasan Buatan)">
                        <input type="text" name="kode_matkul[]" placeholder="Kode (cth: AI301)">
                    </div>
                </div>
                <button type="button" id="btn-tambah-baris-matkul" class="btn btn-outline btn-kecil mt-8">+ Tambah Baris Lain</button>
                <p class="hint">Kosongkan kode jika tidak ada, sistem akan membuatkan otomatis</p>
                <button type="submit" class="btn btn-primer mt-16">Simpan Mata Kuliah</button>
            </form>
        </div>
    </div>
</div>

<div class="toast" id="toast"></div>

<script src="assets/js/common.js"></script>
<script src="assets/js/matkul_saya_dosen.js"></script>
</body>
</html>
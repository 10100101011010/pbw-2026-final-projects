<?php
require_once __DIR__ . '/includes/functions.php';
requireMahasiswa();

$pdo = getKoneksi();
$mahasiswaId = $_SESSION['mahasiswa_id'];

// Semua matkul yang tersedia di sistem, beserta info dosen pengampu
$stmtSemua = $pdo->query("
    SELECT mk.id, mk.kode_matkul, mk.nama_matkul, d.nama AS nama_dosen
    FROM matakuliah mk
    LEFT JOIN dosen d ON d.id = mk.dosen_id
    ORDER BY mk.nama_matkul ASC
");
$semuaMatkul = $stmtSemua->fetchAll();

// Matkul yang sudah diambil mahasiswa ini
$stmtDiambil = $pdo->prepare('SELECT matkul_id FROM mahasiswa_matkul WHERE mahasiswa_id = ?');
$stmtDiambil->execute([$mahasiswaId]);
$idDiambil = array_column($stmtDiambil->fetchAll(), 'matkul_id');

// Detail matkul yang sudah diambil (untuk ditampilkan sebagai list dengan tombol hapus)
$daftarDiambil = array_filter($semuaMatkul, fn($mk) => in_array($mk['id'], $idDiambil));

$halamanAktif = 'matkul-saya';
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mata Kuliah Saya - SIKUT</title>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/includes/sidebar_mahasiswa.php'; ?>

    <div class="main-area">
        <div class="topbar">
            <h1>Mata Kuliah Saya</h1>
        </div>

        <div class="page-content">
            <?php if (($_GET['alasan'] ?? '') === 'wajib'): ?>
                <div class="pesan-alert gagal">
                    Kamu belum memilih mata kuliah apapun! Pilih minimal 1 mata kuliah di bawah!
                </div>
            <?php endif; ?>

            <!-- ============ MATA KULIAH YANG SUDAH DIAMBIL ============ -->
            <h2 style="font-size:16px; margin-bottom:14px;">Mata Kuliah yang Sudah Diambil</h2>

            <?php if (empty($daftarDiambil)): ?>
                <div class="state-kosong">
                    <div class="emoji">🗂️</div>
                    <p>Kamu belum mengambil mata kuliah apapun! Pilih dari daftar di bawah</p>
                </div>
            <?php else: ?>
                <div class="tabel-wrap mt-8">
                    <table>
                        <thead>
                            <tr>
                                <th>Kode</th>
                                <th>Mata Kuliah</th>
                                <th>Dosen Pengampu</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($daftarDiambil as $mk): ?>
                            <tr>
                                <td><span class="badge badge-ungu"><?= htmlspecialchars($mk['kode_matkul']) ?></span></td>
                                <td><?= htmlspecialchars($mk['nama_matkul']) ?></td>
                                <td><?= htmlspecialchars($mk['nama_dosen'] ?? '-') ?></td>
                                <td>
                                    <button class="btn btn-outline btn-kecil btn-hapus-matkul" data-matkul="<?= $mk['id'] ?>" data-nama="<?= htmlspecialchars($mk['nama_matkul']) ?>">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>

            <div class="divider"></div>

            <!-- ============ TAMBAH MATA KULIAH BARU ============ -->
            <div class="flex-between" style="margin-bottom:14px;">
                <h2 style="font-size:16px;">Tambah Mata Kuliah</h2>
            </div>

            <?php $belumDiambil = array_filter($semuaMatkul, fn($mk) => !in_array($mk['id'], $idDiambil)); ?>

            <?php if (empty($belumDiambil)): ?>
                <div class="state-kosong">
                    <div class="emoji">✅</div>
                    <p>Semua mata kuliah yang tersedia di sistem sudah kamu ambil semua</p>
                </div>
            <?php else: ?>
                <form id="form-tambah-matkul-mhs">
                    <div class="checkbox-grid" style="max-height:280px;">
                        <?php foreach ($belumDiambil as $mk): ?>
                            <label class="checkbox-item">
                                <input type="checkbox" name="matkul[]" value="<?= $mk['id'] ?>">
                                <span>
                                    <strong><?= htmlspecialchars($mk['nama_matkul']) ?></strong><br>
                                    <span class="text-muted"><?= htmlspecialchars($mk['kode_matkul']) ?> &middot; <?= htmlspecialchars($mk['nama_dosen'] ?? 'Belum ada dosen') ?></span>
                                </span>
                            </label>
                        <?php endforeach; ?>
                    </div>
                    <button type="submit" class="btn btn-primer mt-16">+ Tambahkan Mata Kuliah Terpilih</button>
                </form>
            <?php endif; ?>
        </div>
    </div>
</div>

<div class="toast" id="toast"></div>

<script src="assets/js/common.js"></script>
<script src="assets/js/matkul_saya_mahasiswa.js"></script>
</body>
</html>
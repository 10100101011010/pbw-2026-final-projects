<?php
require_once __DIR__ . '/includes/functions.php';
requireDosen();

$pdo = getKoneksi();
$dosenId = $_SESSION['dosen_id'];
$matkulId = (int) ($_GET['id'] ?? 0);
$tabAktif = $_GET['tab'] ?? 'tugas';
$tugasDipilih = (int) ($_GET['tugas'] ?? 0);

// Pastikan mata kuliah ini benar milik dosen yang login
$stmtCek = $pdo->prepare('SELECT * FROM matakuliah WHERE id = ? AND dosen_id = ?');
$stmtCek->execute([$matkulId, $dosenId]);
$matkul = $stmtCek->fetch();

if (!$matkul) {
    header('Location: dashboard_dosen.php');
    exit;
}

// Daftar tugas pada mata kuliah ini
$stmtTugas = $pdo->prepare("
    SELECT t.*,
        (SELECT COUNT(*) FROM pengumpulan p WHERE p.tugas_id = t.id) AS jumlah_kumpul
    FROM tugas t WHERE t.matkul_id = ? ORDER BY t.tenggat ASC
");
$stmtTugas->execute([$matkulId]);
$daftarTugas = $stmtTugas->fetchAll();

// Total mahasiswa terdaftar pada matkul ini
$stmtTotalMhs = $pdo->prepare('SELECT COUNT(*) AS total FROM mahasiswa_matkul WHERE matkul_id = ?');
$stmtTotalMhs->execute([$matkulId]);
$totalMahasiswa = $stmtTotalMhs->fetch()['total'];

// Daftar materi
$stmtMateri = $pdo->prepare('SELECT * FROM materi WHERE matkul_id = ? ORDER BY tanggal_upload DESC');
$stmtMateri->execute([$matkulId]);
$daftarMateri = $stmtMateri->fetchAll();

// Jika tab mahasiswa aktif tapi belum pilih tugas, otomatis pilih tugas pertama
if ($tabAktif === 'mahasiswa' && $tugasDipilih === 0 && !empty($daftarTugas)) {
    $tugasDipilih = $daftarTugas[0]['id'];
}

// Data mahasiswa + status pengumpulan untuk tugas yang dipilih
$daftarMahasiswaStatus = [];
if ($tugasDipilih > 0) {
    $stmtMhs = $pdo->prepare("
        SELECT m.id, m.nama, m.npm,
               p.id AS pengumpulan_id, p.nama_file, p.path_file, p.tanggal_kumpul, p.nilai
        FROM mahasiswa_matkul mm
        JOIN mahasiswa m ON m.id = mm.mahasiswa_id
        LEFT JOIN pengumpulan p ON p.mahasiswa_id = m.id AND p.tugas_id = ?
        WHERE mm.matkul_id = ?
        ORDER BY m.nama ASC
    ");
    $stmtMhs->execute([$tugasDipilih, $matkulId]);
    $daftarMahasiswaStatus = $stmtMhs->fetchAll();
}

$halamanAktif = 'dashboard';
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= htmlspecialchars($matkul['nama_matkul']) ?> - SIKUT</title>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/includes/sidebar_dosen.php'; ?>

    <div class="main-area">
        <div class="topbar">
            <h1><?= htmlspecialchars($matkul['nama_matkul']) ?></h1>
            <a href="dashboard_dosen.php" class="btn btn-outline btn-kecil">&larr; Kembali</a>
        </div>

        <div class="page-content">
            <div class="matkul-banner" style="background: linear-gradient(135deg, <?= htmlspecialchars($matkul['warna']) ?>, var(--ungu-900));">
                <div>
                    <span class="kode-chip"><?= htmlspecialchars($matkul['kode_matkul']) ?> &middot; <?= (int)$matkul['sks'] ?> SKS</span>
                    <h1><?= htmlspecialchars($matkul['nama_matkul']) ?></h1>
                    <p><?= $totalMahasiswa ?> mahasiswa terdaftar pada kelas ini</p>
                </div>
            </div>

            <div class="tab-bar">
                <button class="tab-btn <?= $tabAktif === 'tugas' ? 'aktif' : '' ?>" data-tab="tab-tugas">📝 Tugas</button>
                <button class="tab-btn <?= $tabAktif === 'materi' ? 'aktif' : '' ?>" data-tab="tab-materi">🗂️ Materi</button>
                <button class="tab-btn <?= $tabAktif === 'mahasiswa' ? 'aktif' : '' ?>" data-tab="tab-mahasiswa">👩🏻‍🎓 Mahasiswa</button>
            </div>

            <!-- ============ TAB TUGAS ============ -->
            <div class="tab-panel <?= $tabAktif === 'tugas' ? 'aktif' : '' ?>" id="tab-tugas">
                <div class="flex-between mt-8" style="margin-bottom:16px;">
                    <h2 style="font-size:16px;">Daftar Tugas</h2>
                    <button class="btn btn-primer btn-kecil" onclick="bukaModal('modal-tugas')">+ Buat Tugas Baru</button>
                </div>

                <?php if (empty($daftarTugas)): ?>
                    <div class="state-kosong">
                        <div class="emoji">📭</div>
                        <p>Belum ada tugas yang dibuat untuk mata kuliah ini</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($daftarTugas as $t): $status = statusTenggat($t['tenggat']); ?>
                    <div class="kartu-tugas">
                        <div class="tugas-top">
                            <div>
                                <h3><?= htmlspecialchars($t['judul']) ?></h3>
                                <div class="tenggat-info">⏰ Tenggat: <?= formatTanggal($t['tenggat']) ?></div>
                            </div>
                            <span class="badge <?= $status['kelas'] ?>"><?= $status['label'] ?></span>
                        </div>
                        <p class="deskripsi"><?= nl2br(htmlspecialchars($t['deskripsi'])) ?></p>
                        <?php if (!empty($t['path_file'])): ?>
                            <p class="mt-8">
                                <a href="<?= htmlspecialchars($t['path_file']) ?>" target="_blank" class="badge badge-ungu" style="text-decoration:none;">
                                    📎 <?= htmlspecialchars($t['nama_file']) ?>
                                </a>
                            </p>
                        <?php endif; ?>
                        <div class="aksi-row">
                            <span class="badge badge-ungu"><?= $t['jumlah_kumpul'] ?> / <?= $totalMahasiswa ?> sudah mengumpulkan</span>
                            <a href="matkul_dosen.php?id=<?= $matkulId ?>&tab=mahasiswa&tugas=<?= $t['id'] ?>" class="btn btn-outline btn-kecil">Lihat Pengumpulan</a>
                            <button class="btn btn-outline btn-kecil btn-hapus-tugas" data-id="<?= $t['id'] ?>" data-judul="<?= htmlspecialchars($t['judul']) ?>" style="color:var(--merah); border-color:#F3C9C9;">
                                🗑️ Hapus
                            </button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <!-- ============ TAB MATERI ============ -->
            <div class="tab-panel <?= $tabAktif === 'materi' ? 'aktif' : '' ?>" id="tab-materi">
                <div class="flex-between mt-8" style="margin-bottom:16px;">
                    <h2 style="font-size:16px;">Materi Perkuliahan</h2>
                    <button class="btn btn-primer btn-kecil" onclick="bukaModal('modal-materi')">+ Unggah Materi</button>
                </div>

                <?php if (empty($daftarMateri)): ?>
                    <div class="state-kosong">
                        <div class="emoji">📂</div>
                        <p>Belum ada materi yang diunggah</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($daftarMateri as $m): ?>
                    <div class="kartu-materi">
                        <div class="ikon-file">📄</div>
                        <div style="flex:1;">
                            <h4><?= htmlspecialchars($m['judul']) ?></h4>
                            <p><?= nl2br(htmlspecialchars($m['keterangan'])) ?></p>
                            <div class="tanggal">Diunggah <?= formatTanggal($m['tanggal_upload']) ?></div>
                        </div>
                        <?php if (!empty($m['path_file'])): ?>
                            <a href="<?= htmlspecialchars($m['path_file']) ?>" target="_blank" class="btn btn-outline btn-kecil">Unduh</a>
                        <?php endif; ?>
                    </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <!-- ============ TAB MAHASISWA ============ -->
            <div class="tab-panel <?= $tabAktif === 'mahasiswa' ? 'aktif' : '' ?>" id="tab-mahasiswa">
                <?php if (empty($daftarTugas)): ?>
                    <div class="state-kosong">
                        <div class="emoji">🧑‍🎓</div>
                        <p>Buat tugas terlebih dahulu, baru bisa memantau pengumpulan mahasiswa</p>
                    </div>
                <?php else: ?>
                    <form method="GET" action="matkul_dosen.php" class="flex gap-12" style="margin-bottom:18px; align-items:center;">
                        <input type="hidden" name="id" value="<?= $matkulId ?>">
                        <input type="hidden" name="tab" value="mahasiswa">
                        <label style="font-size:13.5px; font-weight:600;">Pilih Tugas:</label>
                        <select name="tugas" onchange="this.form.submit()" style="max-width:340px;">
                            <?php foreach ($daftarTugas as $t): ?>
                                <option value="<?= $t['id'] ?>" <?= $tugasDipilih == $t['id'] ? 'selected' : '' ?>><?= htmlspecialchars($t['judul']) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </form>

                    <div class="tabel-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Mahasiswa</th>
                                    <th>Status</th>
                                    <th>Tanggal Kumpul</th>
                                    <th>File</th>
                                    <th>Nilai</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($daftarMahasiswaStatus as $m):
                                    $sudah = !empty($m['pengumpulan_id']);
                                    $inisial = strtoupper(substr($m['nama'], 0, 1));
                                ?>
                                <tr>
                                    <td>
                                        <span class="avatar-inisial"><?= $inisial ?></span>
                                        <?= htmlspecialchars($m['nama']) ?><br>
                                        <span class="text-muted" style="font-size:12px; margin-left:40px;">NPM <?= htmlspecialchars($m['npm']) ?></span>
                                    </td>
                                    <td>
                                        <?php if ($sudah): ?>
                                            <span class="badge badge-hijau">Sudah Kumpul</span>
                                        <?php else: ?>
                                            <span class="badge badge-merah">Belum Kumpul</span>
                                        <?php endif; ?>
                                    </td>
                                    <td><?= $sudah ? formatTanggal($m['tanggal_kumpul']) : '-' ?></td>
                                    <td>
                                        <?php if ($sudah && $m['path_file']): ?>
                                            <a href="<?= htmlspecialchars($m['path_file']) ?>" target="_blank" class="btn btn-outline btn-kecil">Lihat</a>
                                        <?php else: ?>
                                            <span class="text-muted">-</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ($sudah): ?>
                                            <div class="flex gap-8">
                                                <input type="number" min="0" max="100" class="nilai-input input-nilai"
                                                       value="<?= $m['nilai'] !== null ? (int)$m['nilai'] : '' ?>"
                                                       data-pengumpulan="<?= $m['pengumpulan_id'] ?>">
                                                <button class="btn btn-outline btn-kecil btn-simpan-nilai" data-pengumpulan="<?= $m['pengumpulan_id'] ?>">Simpan</button>
                                            </div>
                                        <?php else: ?>
                                            <span class="text-muted">-</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if (!$sudah): ?>
                                            <button class="btn btn-outline btn-kecil btn-ingatkan"
                                                    data-mahasiswa="<?= $m['id'] ?>"
                                                    data-matkul="<?= $matkulId ?>"
                                                    data-judul="<?= htmlspecialchars(array_values(array_filter($daftarTugas, fn($x) => $x['id'] == $tugasDipilih))[0]['judul'] ?? '') ?>">
                                                🔔 Ingatkan
                                            </button>
                                        <?php else: ?>
                                            <span class="text-muted">-</span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<!-- Modal Buat Tugas -->
<div class="modal-overlay" id="modal-tugas">
    <div class="modal-box">
        <h2>Buat Tugas Baru</h2>
        <p class="sub">Tugas ini akan langsung tampil di dashboard semua mahasiswa peserta kelas</p>
        <form id="form-buat-tugas" enctype="multipart/form-data">
            <input type="hidden" name="matkul_id" value="<?= $matkulId ?>">
            <div class="form-group">
                <label for="judul_tugas">Judul Tugas</label>
                <input type="text" name="judul" id="judul_tugas" required>
            </div>
            <div class="form-group">
                <label for="deskripsi_tugas">Deskripsi / Instruksi</label>
                <textarea name="deskripsi" id="deskripsi_tugas" required></textarea>
            </div>
            <div class="form-group">
                <label for="tenggat_tugas">Tenggat Waktu</label>
                <input type="datetime-local" name="tenggat" id="tenggat_tugas" required>
            </div>
            <div class="form-group">
                <label for="file_tugas">Lampiran File</label>
                <input type="file" name="file_tugas" id="file_tugas">
                <p class="hint">Maks. 10MB (Boleh dikosongkan)</p>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-outline" onclick="tutupModal('modal-tugas')">Batal</button>
                <button type="submit" class="btn btn-primer">Simpan Tugas</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Unggah Materi -->
<div class="modal-overlay" id="modal-materi">
    <div class="modal-box">
        <h2>Unggah Materi</h2>
        <p class="sub">Materi akan bisa dilihat & diunduh oleh semua mahasiswa peserta kelas</p>
        <form id="form-unggah-materi">
            <input type="hidden" name="matkul_id" value="<?= $matkulId ?>">
            <div class="form-group">
                <label for="judul_materi">Judul Materi</label>
                <input type="text" name="judul" id="judul_materi" required>
            </div>
            <div class="form-group">
                <label for="keterangan_materi">Keterangan</label>
                <textarea name="keterangan" id="keterangan_materi"></textarea>
            </div>
            <div class="form-group">
                <label for="file_materi">File Materi (opsional)</label>
                <input type="file" name="file_materi" id="file_materi">
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-outline" onclick="tutupModal('modal-materi')">Batal</button>
                <button type="submit" class="btn btn-primer">Unggah</button>
            </div>
        </form>
    </div>
</div>

<div class="toast" id="toast"></div>

<script src="assets/js/common.js"></script>
<script src="assets/js/dosen.js"></script>
</body>
</html>
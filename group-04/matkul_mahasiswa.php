<?php
require_once __DIR__ . '/includes/functions.php';
requireMahasiswa();

$pdo = getKoneksi();
$mahasiswaId = $_SESSION['mahasiswa_id'];
$matkulId = (int) ($_GET['id'] ?? 0);

// Pastikan mahasiswa memang mengambil mata kuliah ini
$stmtCek = $pdo->prepare("
    SELECT mk.*, d.nama AS nama_dosen, d.email AS email_dosen
    FROM mahasiswa_matkul mm
    JOIN matakuliah mk ON mk.id = mm.matkul_id
    LEFT JOIN dosen d ON d.id = mk.dosen_id
    WHERE mm.mahasiswa_id = ? AND mm.matkul_id = ?
");
$stmtCek->execute([$mahasiswaId, $matkulId]);
$matkul = $stmtCek->fetch();

if (!$matkul) {
    header('Location: dashboard_mahasiswa.php');
    exit;
}

// Ambil daftar tugas + status pengumpulan + status checklist pribadi
$stmtTugas = $pdo->prepare("
    SELECT t.*,
           p.id AS pengumpulan_id, p.nama_file, p.catatan AS catatan_kumpul, p.tanggal_kumpul, p.nilai,
           c.selesai AS checklist_selesai
    FROM tugas t
    LEFT JOIN pengumpulan p ON p.tugas_id = t.id AND p.mahasiswa_id = ?
    LEFT JOIN checklist_tugas c ON c.tugas_id = t.id AND c.mahasiswa_id = ?
    WHERE t.matkul_id = ?
    ORDER BY t.tenggat ASC
");
$stmtTugas->execute([$mahasiswaId, $mahasiswaId, $matkulId]);
$daftarTugas = $stmtTugas->fetchAll();

// Ambil daftar materi
$stmtMateri = $pdo->prepare('SELECT * FROM materi WHERE matkul_id = ? ORDER BY tanggal_upload DESC');
$stmtMateri->execute([$matkulId]);
$daftarMateri = $stmtMateri->fetchAll();
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
    <?php include __DIR__ . '/includes/sidebar_mahasiswa.php'; ?>

    <div class="main-area">
        <div class="topbar">
            <h1><?= htmlspecialchars($matkul['nama_matkul']) ?></h1>
            <a href="dashboard_mahasiswa.php" class="btn btn-outline btn-kecil">&larr; Kembali</a>
        </div>

        <div class="page-content">
            <div class="matkul-banner" style="background: linear-gradient(135deg, <?= htmlspecialchars($matkul['warna']) ?>, var(--ungu-900));">
                <div>
                    <span class="kode-chip"><?= htmlspecialchars($matkul['kode_matkul']) ?> &middot; <?= (int)$matkul['sks'] ?> SKS</span>
                    <h1><?= htmlspecialchars($matkul['nama_matkul']) ?></h1>
                    <p>Dosen Pengampu: <?= htmlspecialchars($matkul['nama_dosen'] ?? '-') ?></p>
                </div>
            </div>

            <div class="tab-bar">
                <button class="tab-btn aktif" data-tab="tab-tugas">📝 Tugas (<?= count($daftarTugas) ?>)</button>
                <button class="tab-btn" data-tab="tab-materi">🗂️ Materi (<?= count($daftarMateri) ?>)</button>
            </div>

            <!-- ============ TAB TUGAS ============ -->
            <div class="tab-panel aktif" id="tab-tugas">
                <?php if (empty($daftarTugas)): ?>
                    <div class="state-kosong">
                        <div class="emoji">📭</div>
                        <p>Belum ada tugas untuk mata kuliah ini</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($daftarTugas as $t):
                        $status = statusTenggat($t['tenggat']);
                        $sudahKumpul = !empty($t['pengumpulan_id']);
                        $selesaiCheck = (int)($t['checklist_selesai'] ?? 0) === 1;
                        $sudahLewatTenggat = strtotime($t['tenggat']) < time();
                    ?>
                    <div class="kartu-tugas">
                        <div class="tugas-top">
                            <div>
                                <h3><?= htmlspecialchars($t['judul']) ?></h3>
                                <div class="tenggat-info">⏰ Tenggat: <?= formatTanggal($t['tenggat']) ?></div>
                            </div>
                            <div class="flex gap-8" style="flex-shrink:0;">
                                <?php if ($sudahKumpul): ?>
                                    <span class="badge badge-hijau">Sudah Dikumpulkan</span>
                                <?php else: ?>
                                    <span class="badge <?= $status['kelas'] ?>"><?= $status['label'] ?></span>
                                <?php endif; ?>
                            </div>
                        </div>

                        <p class="deskripsi"><?= nl2br(htmlspecialchars($t['deskripsi'])) ?></p>

                        <?php if (!empty($t['path_file'])): ?>
                            <p class="mt-8">
                                <a href="<?= htmlspecialchars($t['path_file']) ?>" target="_blank" class="badge badge-ungu" style="text-decoration:none;">
                                    📎 <?= htmlspecialchars($t['nama_file']) ?>
                                </a>
                            </p>
                        <?php endif; ?>

                        <?php if ($sudahKumpul): ?>
                            <p class="text-muted mt-8" style="font-size:13px;">
                                📎 File terkumpul: <strong><?= htmlspecialchars($t['nama_file'] ?? 'catatan tanpa file') ?></strong>
                                &middot; dikumpulkan <?= formatTanggal($t['tanggal_kumpul']) ?>
                                <?php if ($t['nilai'] !== null): ?>
                                    &middot; Nilai: <strong style="color:var(--ungu-700)"><?= $t['nilai'] ?></strong>
                                <?php else: ?>
                                    &middot; <span class="text-muted">Belum dinilai</span>
                                <?php endif; ?>
                            </p>
                        <?php endif; ?>

                        <?php if ($sudahLewatTenggat && !$sudahKumpul): ?>
                            <p class="mt-8" style="font-size:13px; color:var(--merah); font-weight:600;">
                                🔒 Tenggat sudah lewat, pengumpulan untuk tugas ini sudah ditutup
                            </p>
                        <?php endif; ?>

                        <div class="aksi-row">
                            <!-- Checklist to-do PRIBADI: hanya tampil di menu mahasiswa -->
                            <label class="todo-check <?= $selesaiCheck ? 'selesai' : '' ?>">
                                <input type="checkbox" class="cek-checklist" data-tugas="<?= $t['id'] ?>" <?= $selesaiCheck ? 'checked' : '' ?>>
                                <span class="teks-checklist"><?= $selesaiCheck ? 'Sudah aku kerjakan ✓' : 'Tandai sudah dikerjakan' ?></span>
                            </label>

                            <?php if ($sudahLewatTenggat): ?>
                                <button class="btn btn-outline btn-kecil" disabled title="Tenggat sudah lewat" style="opacity:.6; cursor:not-allowed;">
                                    🔒 Tenggat Sudah Lewat
                                </button>
                            <?php else: ?>
                                <button class="btn btn-primer btn-kecil btn-kumpul" data-id="<?= $t['id'] ?>" data-judul="<?= htmlspecialchars($t['judul']) ?>">
                                    <?= $sudahKumpul ? 'Kumpulkan Ulang' : 'Kumpulkan Tugas' ?>
                                </button>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <!-- ============ TAB MATERI ============ -->
            <div class="tab-panel" id="tab-materi">
                <?php if (empty($daftarMateri)): ?>
                    <div class="state-kosong">
                        <div class="emoji">📂</div>
                        <p>Dosen belum mengunggah materi untuk mata kuliah ini</p>
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
        </div>
    </div>
</div>

<!-- Modal Kumpulkan Tugas -->
<div class="modal-overlay" id="modal-kumpul">
    <div class="modal-box">
        <h2>Kumpulkan Tugas</h2>
        <p class="sub" id="modal-judul-tugas">-</p>
        <form id="form-kumpul-tugas">
            <input type="hidden" name="tugas_id" id="input-tugas-id">
            <div class="form-group">
                <label for="file_jawaban">Unggah File Jawaban</label>
                <input type="file" name="file_jawaban" id="file_jawaban">
                <p class="hint">Format bebas (pdf, doc, zip, dll) Maks. 5MB</p>
            </div>
            <div class="form-group">
                <label for="catatan">Catatan (opsional)</label>
                <textarea name="catatan" id="catatan" placeholder="Contoh: link repository / catatan tambahan"></textarea>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-outline" id="btn-batal-kumpul">Batal</button>
                <button type="submit" class="btn btn-primer">Kumpulkan</button>
            </div>
        </form>
    </div>
</div>

<div class="toast" id="toast"></div>

<script src="assets/js/common.js"></script>
<script src="assets/js/mahasiswa.js"></script>
</body>
</html>
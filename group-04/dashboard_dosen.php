<?php
require_once __DIR__ . '/includes/functions.php';
requireDosen();

$pdo = getKoneksi();
$dosenId = $_SESSION['dosen_id'];
$bagianAktif = $_GET['bagian'] ?? 'matkul';
$filterMatkul = (int) ($_GET['matkul_filter'] ?? 0);

// ---------- DATA: Mata kuliah yang diampu ----------
$sqlMatkul = "
    SELECT mk.id, mk.kode_matkul, mk.nama_matkul, mk.sks, mk.warna,
           (SELECT COUNT(*) FROM mahasiswa_matkul mm WHERE mm.matkul_id = mk.id) AS jumlah_mahasiswa,
           (SELECT COUNT(*) FROM tugas t WHERE t.matkul_id = mk.id) AS jumlah_tugas,
           (SELECT COUNT(*) FROM pengumpulan p
                JOIN tugas t2 ON t2.id = p.tugas_id
                WHERE t2.matkul_id = mk.id AND p.nilai IS NULL
           ) AS perlu_dinilai
    FROM matakuliah mk
    WHERE mk.dosen_id = ?
    ORDER BY mk.nama_matkul ASC
";
$stmtMk = $pdo->prepare($sqlMatkul);
$stmtMk->execute([$dosenId]);
$daftarMatkul = $stmtMk->fetchAll();

$totalMatkul = count($daftarMatkul);
$totalMahasiswa = array_sum(array_column($daftarMatkul, 'jumlah_mahasiswa'));
$totalPerluDinilai = array_sum(array_column($daftarMatkul, 'perlu_dinilai'));

// Wajib menambahkan minimal 1 mata kuliah dulu sebelum bisa pakai dashboard
if ($totalMatkul === 0) {
    header('Location: matkul_saya_dosen.php?alasan=wajib');
    exit;
}

// ---------- DATA: Daftar mahasiswa (semua / difilter per matkul), urut A-Z ----------
$daftarMahasiswa = [];
if ($bagianAktif === 'mahasiswa') {
    $sqlMhs = "
        SELECT m.nama, m.npm, m.kelas, mk.nama_matkul, mk.kode_matkul, mk.id AS matkul_id
        FROM mahasiswa_matkul mm
        JOIN mahasiswa m ON m.id = mm.mahasiswa_id
        JOIN matakuliah mk ON mk.id = mm.matkul_id
        WHERE mk.dosen_id = ?
    ";
    $paramMhs = [$dosenId];
    if ($filterMatkul > 0) {
        $sqlMhs .= " AND mk.id = ? ";
        $paramMhs[] = $filterMatkul;
    }
    $sqlMhs .= " ORDER BY m.nama ASC";
    $stmtMhs = $pdo->prepare($sqlMhs);
    $stmtMhs->execute($paramMhs);
    $daftarMahasiswa = $stmtMhs->fetchAll();
}

// ---------- DATA: Tugas yang perlu dinilai ----------
$daftarPerluDinilai = [];
if ($bagianAktif === 'nilai') {
    $stmtNilai = $pdo->prepare("
        SELECT p.id AS pengumpulan_id, p.tanggal_kumpul, p.nama_file, p.path_file, p.catatan,
               m.nama AS nama_mahasiswa, m.npm,
               t.judul AS judul_tugas,
               mk.nama_matkul, mk.kode_matkul
        FROM pengumpulan p
        JOIN mahasiswa m ON m.id = p.mahasiswa_id
        JOIN tugas t ON t.id = p.tugas_id
        JOIN matakuliah mk ON mk.id = t.matkul_id
        WHERE mk.dosen_id = ? AND p.nilai IS NULL
        ORDER BY p.tanggal_kumpul ASC
    ");
    $stmtNilai->execute([$dosenId]);
    $daftarPerluDinilai = $stmtNilai->fetchAll();
}

$halamanAktif = 'dashboard';
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard Dosen</title>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/includes/sidebar_dosen.php'; ?>

    <div class="main-area">
        <div class="topbar">
            <h1>Dashboard Dosen</h1>
        </div>

        <div class="page-content">
            <div class="grid-stat">
                <a href="dashboard_dosen.php?bagian=matkul" class="kartu-stat kartu-stat-klik <?= $bagianAktif === 'matkul' ? 'aktif' : '' ?>">
                    <div class="ikon">📚</div>
                    <div>
                        <div class="angka"><?= $totalMatkul ?></div>
                        <div class="label">Mata Kuliah Diampu</div>
                    </div>
                </a>
                <a href="dashboard_dosen.php?bagian=mahasiswa" class="kartu-stat kartu-stat-klik <?= $bagianAktif === 'mahasiswa' ? 'aktif' : '' ?>">
                    <div class="ikon">👩🏻‍🎓</div>
                    <div>
                        <div class="angka"><?= $totalMahasiswa ?></div>
                        <div class="label">Total Mahasiswa</div>
                    </div>
                </a>
                <a href="dashboard_dosen.php?bagian=nilai" class="kartu-stat kartu-stat-klik <?= $bagianAktif === 'nilai' ? 'aktif' : '' ?>">
                    <div class="ikon">🖊️</div>
                    <div>
                        <div class="angka"><?= $totalPerluDinilai ?></div>
                        <div class="label">Tugas Perlu Dinilai</div>
                    </div>
                </a>
            </div>

            <!-- ============ BAGIAN: MATA KULIAH DIAMPU ============ -->
            <?php if ($bagianAktif === 'matkul'): ?>
                <div class="flex-between mt-24" style="margin-bottom:16px;">
                    <h2 style="font-size:18px;">Kelas yang Anda Ampu</h2>
                </div>

                <?php if (empty($daftarMatkul)): ?>
                    <div class="state-kosong">
                        <div class="emoji">🗂️</div>
                        <p>Anda belum mengampu mata kuliah apapun</p>
                    </div>
                <?php else: ?>
                    <div class="grid-matkul">
                        <?php foreach ($daftarMatkul as $mk): ?>
                            <a href="matkul_dosen.php?id=<?= $mk['id'] ?>" class="kartu-matkul">
                                <div class="kartu-header" style="background: linear-gradient(135deg, <?= htmlspecialchars($mk['warna']) ?>, var(--ungu-900));">
                                    <span class="kode-chip"><?= htmlspecialchars($mk['kode_matkul']) ?></span>
                                    <h3><?= htmlspecialchars($mk['nama_matkul']) ?></h3>
                                </div>
                                <div class="kartu-body">
                                    <div class="dosen-nama">👩🏻‍🎓 <?= $mk['jumlah_mahasiswa'] ?> mahasiswa terdaftar</div>
                                    <div class="meta-row">
                                        <span class="meta-badge"><?= $mk['jumlah_tugas'] ?> tugas</span>
                                        <?php if ($mk['perlu_dinilai'] > 0): ?>
                                            <span class="badge badge-kuning"><?= $mk['perlu_dinilai'] ?> perlu dinilai</span>
                                        <?php else: ?>
                                            <span class="badge badge-hijau">Semua ternilai</span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            <?php endif; ?>

            <!-- ============ BAGIAN: TOTAL MAHASISWA ============ -->
            <?php if ($bagianAktif === 'mahasiswa'): ?>
                <div class="flex-between mt-24" style="margin-bottom:16px; flex-wrap:wrap; gap:12px;">
                    <h2 style="font-size:18px;">Daftar Mahasiswa</h2>

                    <form method="GET" action="dashboard_dosen.php" class="flex gap-12" style="align-items:center;">
                        <input type="hidden" name="bagian" value="mahasiswa">
                        <label style="font-size:13.5px; font-weight:600;">Mata Kuliah:</label>
                        <select name="matkul_filter" onchange="this.form.submit()" style="min-width:220px;">
                            <option value="0">Semua Mata Kuliah</option>
                            <?php foreach ($daftarMatkul as $mk): ?>
                                <option value="<?= $mk['id'] ?>" <?= $filterMatkul == $mk['id'] ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($mk['kode_matkul']) ?> - <?= htmlspecialchars($mk['nama_matkul']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </form>
                </div>

                <?php if (empty($daftarMahasiswa)): ?>
                    <div class="state-kosong">
                        <div class="emoji">🧑‍🎓</div>
                        <p>Belum ada mahasiswa yang terdaftar pada mata kuliah ini</p>
                    </div>
                <?php else: ?>
                    <div class="tabel-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Mahasiswa</th>
                                    <th>Kelas</th>
                                    <th>Mata Kuliah</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($daftarMahasiswa as $m): $inisial = strtoupper(substr($m['nama'], 0, 1)); ?>
                                <tr>
                                    <td>
                                        <span class="avatar-inisial"><?= $inisial ?></span>
                                        <?= htmlspecialchars($m['nama']) ?><br>
                                        <span class="text-muted" style="font-size:12px; margin-left:40px;">NPM <?= htmlspecialchars($m['npm']) ?></span>
                                    </td>
                                    <td><?= htmlspecialchars($m['kelas']) ?></td>
                                    <td><span class="badge badge-ungu"><?= htmlspecialchars($m['kode_matkul']) ?></span> <?= htmlspecialchars($m['nama_matkul']) ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            <?php endif; ?>

            <!-- ============ BAGIAN: TUGAS PERLU DINILAI ============ -->
            <?php if ($bagianAktif === 'nilai'): ?>
                <div class="flex-between mt-24" style="margin-bottom:16px;">
                    <h2 style="font-size:18px;">Tugas yang Perlu Dinilai</h2>
                </div>

                <?php if (empty($daftarPerluDinilai)): ?>
                    <div class="state-kosong">
                        <div class="emoji">✅</div>
                        <p>Semua tugas yang masuk sudah dinilai!</p>
                    </div>
                <?php else: ?>
                    <div class="tabel-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Mahasiswa</th>
                                    <th>Tugas</th>
                                    <th>Mata Kuliah</th>
                                    <th>Dikumpulkan</th>
                                    <th>File</th>
                                    <th>Nilai</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($daftarPerluDinilai as $p): $inisial = strtoupper(substr($p['nama_mahasiswa'], 0, 1)); ?>
                                <tr>
                                    <td>
                                        <span class="avatar-inisial"><?= $inisial ?></span>
                                        <?= htmlspecialchars($p['nama_mahasiswa']) ?><br>
                                        <span class="text-muted" style="font-size:12px; margin-left:40px;">NPM <?= htmlspecialchars($p['npm']) ?></span>
                                    </td>
                                    <td><?= htmlspecialchars($p['judul_tugas']) ?></td>
                                    <td><span class="badge badge-ungu"><?= htmlspecialchars($p['kode_matkul']) ?></span> <?= htmlspecialchars($p['nama_matkul']) ?></td>
                                    <td><?= formatTanggal($p['tanggal_kumpul']) ?></td>
                                    <td>
                                        <?php if ($p['path_file']): ?>
                                            <a href="<?= htmlspecialchars($p['path_file']) ?>" target="_blank" class="btn btn-outline btn-kecil">Lihat</a>
                                        <?php else: ?>
                                            <span class="text-muted">-</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div class="flex gap-8">
                                            <input type="number" min="0" max="100" class="nilai-input input-nilai" data-pengumpulan="<?= $p['pengumpulan_id'] ?>">
                                            <button class="btn btn-outline btn-kecil btn-simpan-nilai" data-pengumpulan="<?= $p['pengumpulan_id'] ?>">Simpan</button>
                                        </div>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            <?php endif; ?>
        </div>
    </div>
</div>

<div class="toast" id="toast"></div>

<script src="assets/js/common.js"></script>
<script src="assets/js/dosen.js"></script>
</body>
</html>
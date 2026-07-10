<?php
require_once __DIR__ . '/includes/functions.php';
requireMahasiswa();

$pdo = getKoneksi();
$mahasiswaId = $_SESSION['mahasiswa_id'];

$stmt = $pdo->prepare('SELECT * FROM mahasiswa WHERE id = ?');
$stmt->execute([$mahasiswaId]);
$mhs = $stmt->fetch();

$bagianAktif = $_GET['bagian'] ?? 'matkul';
$filterMatkul = (int) ($_GET['matkul_filter'] ?? 0);

// ---------- DATA: Mata kuliah yang diambil ----------
$sqlMatkul = "
    SELECT mk.id, mk.kode_matkul, mk.nama_matkul, mk.sks, mk.warna,
           d.nama AS nama_dosen,
           (SELECT COUNT(*) FROM tugas t WHERE t.matkul_id = mk.id) AS jumlah_tugas,
           (SELECT COUNT(*) FROM tugas t
                WHERE t.matkul_id = mk.id
                AND t.id NOT IN (SELECT tugas_id FROM pengumpulan WHERE mahasiswa_id = ?)
           ) AS tugas_belum
    FROM mahasiswa_matkul mm
    JOIN matakuliah mk ON mk.id = mm.matkul_id
    LEFT JOIN dosen d ON d.id = mk.dosen_id
    WHERE mm.mahasiswa_id = ?
    ORDER BY mk.nama_matkul ASC
";
$stmtMk = $pdo->prepare($sqlMatkul);
$stmtMk->execute([$mahasiswaId, $mahasiswaId]);
$daftarMatkul = $stmtMk->fetchAll();

$totalMatkul = count($daftarMatkul);
$totalTugasBelum = array_sum(array_column($daftarMatkul, 'tugas_belum'));
$totalTugas = array_sum(array_column($daftarMatkul, 'jumlah_tugas'));

// Wajib pilih minimal 1 mata kuliah dulu sebelum bisa pakai dashboard
if ($totalMatkul === 0) {
    header('Location: matkul_saya_mahasiswa.php?alasan=wajib');
    exit;
}

// Total catatan to-do pribadi yang belum selesai (untuk kartu statistik, selalu dihitung)
$stmtTotalTodo = $pdo->prepare('SELECT COUNT(*) AS total FROM todo_pribadi WHERE mahasiswa_id = ? AND selesai = 0');
$stmtTotalTodo->execute([$mahasiswaId]);
$totalTodoBelum = $stmtTotalTodo->fetch()['total'];

// Catatan to-do yang tanggal reminder-nya persis hari ini & belum selesai (untuk banner "Hari-H")
$stmtTodoHariIni = $pdo->prepare("
    SELECT * FROM todo_pribadi
    WHERE mahasiswa_id = ? AND selesai = 0 AND tanggal_reminder = CURDATE()
    ORDER BY dibuat_pada ASC
");
$stmtTodoHariIni->execute([$mahasiswaId]);
$todoHariIni = $stmtTodoHariIni->fetchAll();

// ---------- DATA: Semua tugas (untuk bagian "Total Tugas") ----------
$tugasBelum = [];
$tugasSelesai = [];
if ($bagianAktif === 'tugas') {
    $sqlTugas = "
        SELECT t.*, mk.nama_matkul, mk.kode_matkul, mk.warna,
               p.id AS pengumpulan_id, p.nilai,
               c.selesai AS checklist_selesai
        FROM tugas t
        JOIN matakuliah mk ON mk.id = t.matkul_id
        JOIN mahasiswa_matkul mm ON mm.matkul_id = mk.id AND mm.mahasiswa_id = ?
        LEFT JOIN pengumpulan p ON p.tugas_id = t.id AND p.mahasiswa_id = ?
        LEFT JOIN checklist_tugas c ON c.tugas_id = t.id AND c.mahasiswa_id = ?
        WHERE 1 = 1
    ";
    $paramTugas = [$mahasiswaId, $mahasiswaId, $mahasiswaId];
    if ($filterMatkul > 0) {
        $sqlTugas .= " AND mk.id = ? ";
        $paramTugas[] = $filterMatkul;
    }
    $sqlTugas .= " ORDER BY t.tenggat ASC";
    $stmtTugas = $pdo->prepare($sqlTugas);
    $stmtTugas->execute($paramTugas);
    $semuaTugas = $stmtTugas->fetchAll();

    foreach ($semuaTugas as $t) {
        if ((int) ($t['checklist_selesai'] ?? 0) === 1) {
            $tugasSelesai[] = $t;
        } else {
            $tugasBelum[] = $t;
        }
    }
}

// ---------- DATA: To-do list pribadi ----------
$daftarTodo = [];
if ($bagianAktif === 'todo') {
    $stmtTodo = $pdo->prepare("
        SELECT * FROM todo_pribadi
        WHERE mahasiswa_id = ?
        ORDER BY selesai ASC, (tanggal_reminder IS NULL) ASC, tanggal_reminder ASC, dibuat_pada DESC
    ");
    $stmtTodo->execute([$mahasiswaId]);
    $daftarTodo = $stmtTodo->fetchAll();
}

// Notifikasi / pengingat dari dosen
$stmtNotif = $pdo->prepare('SELECT * FROM notifikasi WHERE mahasiswa_id = ? ORDER BY dibuat_pada DESC LIMIT 8');
$stmtNotif->execute([$mahasiswaId]);
$daftarNotif = $stmtNotif->fetchAll();
$notifBelumDibaca = count(array_filter($daftarNotif, fn($n) => $n['sudah_dibaca'] == 0));

$halamanAktif = 'dashboard';
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard Mahasiswa</title>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/includes/sidebar_mahasiswa.php'; ?>

    <div class="main-area">
        <div class="topbar">
            <h1>Dashboard Mahasiswa</h1>
            <div class="topbar-kanan">
                <div class="bell-wrap">
                    <button class="btn-icon" id="btn-lonceng">🔔<?php if ($notifBelumDibaca > 0): ?><span class="bell-dot"></span><?php endif; ?></button>
                    <div class="dropdown-notif" id="dropdown-notif">
                        <p style="font-weight:700; padding:8px 10px; font-size:13.5px;">Pengingat dari Dosen</p>
                        <?php if (empty($daftarNotif)): ?>
                            <p class="text-muted" style="padding:12px 10px; font-size:13px;">Belum ada pengingat</p>
                        <?php else: ?>
                            <?php foreach ($daftarNotif as $n): ?>
                                <div class="item-notif">
                                    <?= htmlspecialchars($n['pesan']) ?>
                                    <div class="waktu"><?= formatTanggal($n['dibuat_pada']) ?></div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-content">
            <?php if (!empty($todoHariIni)): ?>
                <div class="banner-hari-ini">
                    <?php foreach ($todoHariIni as $th): ?>
                        <div class="banner-hari-ini-item">
                            <span class="banner-hari-ini-emoji">🎉</span>
                            <div>
                                <strong>Hari ini: <?= htmlspecialchars($th['judul']) ?>!</strong>
                                <?php if (!empty($th['catatan'])): ?>
                                    <p><?= htmlspecialchars($th['catatan']) ?></p>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <div class="grid-stat">
                <a href="dashboard_mahasiswa.php?bagian=matkul" class="kartu-stat kartu-stat-klik <?= $bagianAktif === 'matkul' ? 'aktif' : '' ?>">
                    <div class="ikon">📚</div>
                    <div>
                        <div class="angka"><?= $totalMatkul ?></div>
                        <div class="label">Mata Kuliah</div>
                    </div>
                </a>
                <a href="dashboard_mahasiswa.php?bagian=tugas" class="kartu-stat kartu-stat-klik <?= $bagianAktif === 'tugas' ? 'aktif' : '' ?>">
                    <div class="ikon">📝</div>
                    <div>
                        <div class="angka"><?= $totalTugas ?></div>
                        <div class="label">Total Tugas</div>
                    </div>
                </a>
                <a href="dashboard_mahasiswa.php?bagian=todo" class="kartu-stat kartu-stat-klik <?= $bagianAktif === 'todo' ? 'aktif' : '' ?>">
                    <div class="ikon">🗓️</div>
                    <div>
                        <div class="angka"><?= $totalTodoBelum ?></div>
                        <div class="label">To-Do-List</div>
                    </div>
                </a>
            </div>

            <!-- ============ BAGIAN: MATA KULIAH ============ -->
            <?php if ($bagianAktif === 'matkul'): ?>
                <div class="flex-between mt-24" style="margin-bottom:16px;">
                    <h2 style="font-size:18px;">Mata Kuliah Kamu</h2>
                </div>

                <?php if (empty($daftarMatkul)): ?>
                    <div class="state-kosong">
                        <div class="emoji">🗂️</div>
                        <p>Kamu belum memiliki mata kuliah! Silakan hubungi admin/dosen jika ada kesalahan pendaftaran</p>
                    </div>
                <?php else: ?>
                    <div class="grid-matkul">
                        <?php foreach ($daftarMatkul as $mk): ?>
                            <a href="matkul_mahasiswa.php?id=<?= $mk['id'] ?>" class="kartu-matkul">
                                <div class="kartu-header" style="background: linear-gradient(135deg, <?= htmlspecialchars($mk['warna']) ?>, var(--ungu-900));">
                                    <span class="kode-chip"><?= htmlspecialchars($mk['kode_matkul']) ?></span>
                                    <h3><?= htmlspecialchars($mk['nama_matkul']) ?></h3>
                                </div>
                                <div class="kartu-body">
                                    <div class="dosen-nama">👤 <?= htmlspecialchars($mk['nama_dosen'] ?? 'Belum ada dosen') ?></div>
                                    <div class="meta-row">
                                        <span class="meta-badge"><?= $mk['jumlah_tugas'] ?> tugas</span>
                                        <?php if ($mk['tugas_belum'] > 0): ?>
                                            <span class="badge badge-merah"><?= $mk['tugas_belum'] ?> belum dikerjakan</span>
                                        <?php else: ?>
                                            <span class="badge badge-hijau">Semua selesai</span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            <?php endif; ?>

            <!-- ============ BAGIAN: TOTAL TUGAS ============ -->
            <?php if ($bagianAktif === 'tugas'): ?>
                <div class="flex-between mt-24" style="margin-bottom:16px; flex-wrap:wrap; gap:12px;">
                    <h2 style="font-size:18px;">Semua Tugas Kamu</h2>

                    <form method="GET" action="dashboard_mahasiswa.php" class="flex gap-12" style="align-items:center;">
                        <input type="hidden" name="bagian" value="tugas">
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

                <?php if (empty($tugasBelum) && empty($tugasSelesai)): ?>
                    <div class="state-kosong">
                        <div class="emoji">📭</div>
                        <p>Belum ada tugas untuk ditampilkan</p>
                    </div>
                <?php else: ?>
                    <h3 style="font-size:14.5px; color:var(--teks-sekunder); margin-bottom:12px;">🕗 Belum Dikerjakan (<?= count($tugasBelum) ?>)</h3>
                    <?php if (empty($tugasBelum)): ?>
                        <div class="state-kosong mt-8" style="padding:24px;"><p>Semua tugas kamu sudah kamu selesai!!</p></div>
                    <?php else: ?>
                        <?php foreach ($tugasBelum as $t): $status = statusTenggat($t['tenggat']); ?>
                        <div class="kartu-tugas">
                            <div class="tugas-top">
                                <div>
                                    <span class="badge badge-ungu" style="margin-bottom:6px; display:inline-block;"><?= htmlspecialchars($t['kode_matkul']) ?></span>
                                    <h3><?= htmlspecialchars($t['judul']) ?></h3>
                                    <div class="tenggat-info">⏰ Tenggat: <?= formatTanggal($t['tenggat']) ?> &middot; <?= htmlspecialchars($t['nama_matkul']) ?></div>
                                </div>
                                <?php if (!empty($t['pengumpulan_id'])): ?>
                                    <span class="badge badge-hijau">Sudah Dikumpulkan</span>
                                <?php else: ?>
                                    <span class="badge <?= $status['kelas'] ?>"><?= $status['label'] ?></span>
                                <?php endif; ?>
                            </div>
                            <div class="aksi-row">
                                <label class="todo-check">
                                    <input type="checkbox" class="cek-checklist" data-tugas="<?= $t['id'] ?>">
                                    <span class="teks-checklist">Tandai sudah dikerjakan</span>
                                </label>
                                <a href="matkul_mahasiswa.php?id=<?= $t['matkul_id'] ?>" class="btn btn-outline btn-kecil">Buka Mata Kuliah</a>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    <?php endif; ?>

                    <h3 style="font-size:14.5px; color:var(--teks-sekunder); margin:24px 0 12px;">✅ Sudah Dikerjakan (<?= count($tugasSelesai) ?>)</h3>
                    <?php if (empty($tugasSelesai)): ?>
                        <div class="state-kosong mt-8" style="padding:24px;"><p>Belum ada tugas yang ditandai selesai</p></div>
                    <?php else: ?>
                        <?php foreach ($tugasSelesai as $t): ?>
                        <div class="kartu-tugas" style="opacity:.75;">
                            <div class="tugas-top">
                                <div>
                                    <span class="badge badge-ungu" style="margin-bottom:6px; display:inline-block;"><?= htmlspecialchars($t['kode_matkul']) ?></span>
                                    <h3 style="text-decoration:line-through;"><?= htmlspecialchars($t['judul']) ?></h3>
                                    <div class="tenggat-info">⏰ Tenggat: <?= formatTanggal($t['tenggat']) ?> &middot; <?= htmlspecialchars($t['nama_matkul']) ?></div>
                                </div>
                                <?php if (!empty($t['pengumpulan_id'])): ?>
                                    <span class="badge badge-hijau">Sudah Dikumpulkan</span>
                                <?php else: ?>
                                    <span class="badge badge-abu">Belum Dikumpulkan</span>
                                <?php endif; ?>
                            </div>
                            <div class="aksi-row">
                                <label class="todo-check selesai">
                                    <input type="checkbox" class="cek-checklist" data-tugas="<?= $t['id'] ?>" checked>
                                    <span class="teks-checklist">Sudah dikerjakan ✓</span>
                                </label>
                                <a href="matkul_mahasiswa.php?id=<?= $t['matkul_id'] ?>" class="btn btn-outline btn-kecil">Buka Mata Kuliah</a>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                <?php endif; ?>
            <?php endif; ?>

            <!-- ============ BAGIAN: TO-DO LIST PRIBADI ============ -->
            <?php if ($bagianAktif === 'todo'): ?>
                <div class="flex-between mt-24" style="margin-bottom:16px;">
                    <h2 style="font-size:18px;">To-Do-List</h2>
                    <button class="btn btn-primer btn-kecil" onclick="bukaModal('modal-todo')">+ Tambah Catatan</button>
                </div>
                <p class="text-muted mt-8" style="margin-bottom:18px; font-size:13.5px;">
                    Catatan pribadi mahasiswa — cocok buat pengingat ujian, tugas kelompok, atau kegiatan lainnya
                </p>

                <?php if (empty($daftarTodo)): ?>
                    <div class="state-kosong">
                        <div class="emoji">🗓️</div>
                        <p>Belum ada catatan</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($daftarTodo as $td): $sudahSelesai = (int)$td['selesai'] === 1; ?>
                    <div class="kartu-todo-pribadi <?= $sudahSelesai ? 'selesai' : '' ?>">
                        <label class="todo-check-bulat">
                            <input type="checkbox" class="cek-todo" data-todo="<?= $td['id'] ?>" <?= $sudahSelesai ? 'checked' : '' ?>>
                            <span></span>
                        </label>
                        <div style="flex:1;">
                            <h4 style="<?= $sudahSelesai ? 'text-decoration:line-through; opacity:.6;' : '' ?>"><?= htmlspecialchars($td['judul']) ?></h4>
                            <?php if (!empty($td['catatan'])): ?>
                                <p><?= nl2br(htmlspecialchars($td['catatan'])) ?></p>
                            <?php endif; ?>
                            <?php if (!empty($td['tanggal_reminder'])):
                                $isHariIni = !$sudahSelesai && $td['tanggal_reminder'] === date('Y-m-d');
                            ?>
                                <?php if ($isHariIni): ?>
                                    <span class="badge badge-merah">🎉 Hari Ini!</span>
                                <?php else: ?>
                                    <span class="badge badge-kuning">📅 <?= date('d M Y', strtotime($td['tanggal_reminder'])) ?></span>
                                <?php endif; ?>
                            <?php endif; ?>
                        </div>
                        <button class="btn-icon btn-hapus-todo" data-todo="<?= $td['id'] ?>" title="Hapus">🗑️</button>
                    </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            <?php endif; ?>
        </div>
    </div>
</div>

<!-- Modal Tambah Catatan To-Do -->
<div class="modal-overlay" id="modal-todo">
    <div class="modal-box">
        <h2>Tambah Catatan Pribadi</h2>
        <p class="sub">Tenang catatan ini tidak bisa dilihat dosen kok</p>
        <form id="form-tambah-todo">
            <div class="form-group">
                <label for="judul_todo">Judul</label>
                <input type="text" name="judul" id="judul_todo" placeholder="Contoh: Ujian PBO" required>
            </div>
            <div class="form-group">
                <label for="catatan_todo">Catatan (opsional)</label>
                <textarea name="catatan" id="catatan_todo" placeholder="Contoh: Materi bab 1-5, ruang lab komputer 2"></textarea>
            </div>
            <div class="form-group">
                <label for="tanggal_todo">Tanggal Reminder (opsional)</label>
                <input type="date" name="tanggal_reminder" id="tanggal_todo">
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-outline" onclick="tutupModal('modal-todo')">Batal</button>
                <button type="submit" class="btn btn-primer">Simpan Catatan</button>
            </div>
        </form>
    </div>
</div>

<div class="toast" id="toast"></div>

<script>
document.getElementById('btn-lonceng').addEventListener('click', function () {
    document.getElementById('dropdown-notif').classList.toggle('aktif');
});
document.addEventListener('click', function (e) {
    if (!e.target.closest('.bell-wrap')) {
        document.getElementById('dropdown-notif').classList.remove('aktif');
    }
});
</script>
<script src="assets/js/common.js"></script>
<script src="assets/js/mahasiswa.js"></script>
</body>
</html>
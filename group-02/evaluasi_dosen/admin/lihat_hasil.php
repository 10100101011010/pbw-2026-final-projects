<?php
session_start();
if (!isset($_SESSION['role']) || $_SESSION['role'] != 'admin') {
    header("Location: ../index.php");
    exit();
}
require '../db.php';

$type = $_GET['type'] ?? 'dosen';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Hasil Evaluasi - Admin</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <!-- HEADER -->
    <div class="top-bar">
        <div class="wrapper">
            <div class="logo-area">
                <div class="logo-icon">UG</div>
                <div class="logo-text">
                    <span class="univ-name">UNIVERSITAS GUNADARMA</span>
                    <span class="portal-name">Portal <span>Evaluasi</span></span>
                </div>
            </div>
            <div class="user-menu">
                <span class="user-name"> <strong><?= $_SESSION['user_nama'] ?></strong> (Admin)</span>
                <a href="../logout.php" class="btn-logout">Keluar</a>
            </div>
        </div>
    </div>

    <!-- BREADCRUMB -->
    <div class="breadcrumb">
        <div class="wrapper">
            <a href="dashboard.php">Dashboard</a>
            <span class="separator">›</span>
            <a href="lihat_hasil.php">Hasil Evaluasi</a>
            <span class="separator">›</span>
            <span><?= $type == 'dosen' ? 'Dosen' : 'Matakuliah' ?></span>
        </div>
    </div>

    <!-- CONTENT -->
    <div class="wrapper">
        <div class="page-title">
            <h2> Hasil Evaluasi</h2>
            <p>Rekapitulasi hasil evaluasi dosen</p>
        </div>

        <a href="dashboard.php" class="btn-back">← Kembali ke Dashboard</a>

        <div class="tab-group">
            <a href="?type=dosen" class="<?= $type == 'dosen' ? 'active' : '' ?>"> Evaluasi Dosen</a>
        </div>

        <div class="table-wrapper">
            <?php if ($type == 'dosen'): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Nama Dosen</th>
                            <th>Semester</th>
                            <th>Responden</th>
                            <th>Pengajaran</th>
                            <th>Komunikasi</th>
                            <th>Kedisiplinan</th>
                            <th>Rata²</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $sql = "SELECT d.nama, ed.semester,
                                    COUNT(*) as jumlah,
                                    ROUND(AVG(ed.nilai_pengajaran), 2) as avg_p,
                                    ROUND(AVG(ed.nilai_komunikasi), 2) as avg_k,
                                    ROUND(AVG(ed.nilai_kedisiplinan), 2) as avg_d
                                FROM evaluasi_dosen ed
                                JOIN dosen d ON ed.dosen_id = d.id
                                GROUP BY d.id, ed.semester 
                                ORDER BY d.nama"; // Urutkan hasil A-Z
                        $res = mysqli_query($conn, $sql);
                        while ($row = mysqli_fetch_assoc($res)):
                            $rata = round(($row['avg_p'] + $row['avg_k'] + $row['avg_d']) / 3, 2);
                            if ($rata >= 4) {
                                $badge = 'badge-hijau';
                                $label = 'Baik';
                            } elseif ($rata >= 3) {
                                $badge = 'badge-kuning';
                                $label = 'Cukup';
                            } else {
                                $badge = 'badge-merah';
                                $label = 'Perlu Perhatian';
                            }
                        ?>
                        <tr>
                            <td><strong><?= $row['nama'] ?></strong></td>
                            <td><?= $row['semester'] ?></td>
                            <td><?= $row['jumlah'] ?></td>
                            <td><?= $row['avg_p'] ?> / 5</td>
                            <td><?= $row['avg_k'] ?> / 5</td>
                            <td><?= $row['avg_d'] ?> / 5</td>
                            <td><strong><?= $rata ?></strong></td>
                            <td><span class="badge <?= $badge ?>"><?= $label ?></span></td>
                        </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <table>
                    <thead>
                        <tr>
                            <th>Mata Kuliah</th>
                            <th>Semester</th>
                            <th>Responden</th>
                            <th>Materi</th>
                            <th>Relevansi</th>
                            <th>Beban</th>
                            <th>Rata²</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $sql = "SELECT mk.nama, em.semester,
                                    COUNT(*) as jumlah,
                                    ROUND(AVG(em.nilai_materi), 2) as avg_m,
                                    ROUND(AVG(em.nilai_relevansi), 2) as avg_r,
                                    ROUND(AVG(em.nilai_beban), 2) as avg_b
                                FROM evaluasi_matkul em
                                JOIN matakuliah mk ON em.matkul_id = mk.id
                                GROUP BY mk.id, em.semester
                                ORDER BY mk.nama";
                        $res = mysqli_query($conn, $sql);
                        while ($row = mysqli_fetch_assoc($res)):
                            $rata = round(($row['avg_m'] + $row['avg_r'] + $row['avg_b']) / 3, 2);
                            if ($rata >= 4) {
                                $badge = 'badge-hijau';
                                $label = 'Baik';
                            } elseif ($rata >= 3) {
                                $badge = 'badge-kuning';
                                $label = 'Cukup';
                            } else {
                                $badge = 'badge-merah';
                                $label = 'Perlu Perhatian';
                            }
                        ?>
                        <tr>
                            <td><strong><?= $row['nama'] ?></strong></td>
                            <td><?= $row['semester'] ?></td>
                            <td><?= $row['jumlah'] ?></td>
                            <td><?= $row['avg_m'] ?> / 5</td>
                            <td><?= $row['avg_r'] ?> / 5</td>
                            <td><?= $row['avg_b'] ?> / 5</td>
                            <td><strong><?= $rata ?></strong></td>
                            <td><span class="badge <?= $badge ?>"><?= $label ?></span></td>
                        </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
        <div class="wrapper">
            <span>© 2026 Universitas Gunadarma</span>
            <span>|</span>
            <span>Portal Evaluasi Dosen &amp; Matakuliah</span>
            <span>|</span>
            <span>BAAK - Gunadarma</span>
        </div>
    </div>
</body>
</html>
<!-- BAGIAN ATAS -->
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
    <title>Daftar Responden - Admin</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <div class="top-bar">
        <div class="wrapper">
            <div class="logo-area">
                <div class="logo-icon">UG</div>
                <div class="logo-text">
                    <span class="univ-name">UNIVERSITAS GUNADARMA</span>
                    <span class="portal-name">Portal Evaluasi</span>
                </div>
            </div>
            <div class="user-menu">
                <span class="user-name"><strong><?= $_SESSION['user_nama'] ?></strong> (Admin)</span>
                <a href="../logout.php" class="btn-logout">Keluar</a>
            </div>
        </div>
    </div>

    <!-- BREADCRUMB -->
    <div class="breadcrumb">
        <div class="wrapper">
            <a href="dashboard.php">Dashboard</a>
            <span class="separator">›</span>
            <span>Daftar Responden</span>
        </div>
    </div>

    <div class="wrapper">
        <div class="page-title">
            <h2>Daftar Responden</h2>
            <p>Lihat siapa saja yang sudah mengisi evaluasi</p>
        </div>

        <a href="dashboard.php" class="btn-back">← Kembali ke Dashboard</a>

        <div class="tab-group">
            <a href="?type=dosen" class="active">Responden Dosen</a>
        </div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Dosen</th>
                        <th>Mahasiswa</th>
                        <th>NPM</th>
                        <th>Semester</th>
                        <th>Tanggal</th>
                        <th>Nilai</th>
                        <th>Komentar</th>
                    </tr>
                </thead>
                <tbody>

                <!-- QUERY SQL -->
                    <?php
                    $sql = "SELECT d.nama as dosen, m.nama as mahasiswa, m.npm, ed.semester, 
                            ed.tanggal, ed.nilai_pengajaran, ed.nilai_komunikasi, ed.nilai_kedisiplinan, ed.komentar
                            FROM evaluasi_dosen ed
                            JOIN dosen d ON ed.dosen_id = d.id
                            JOIN mahasiswa m ON ed.mahasiswa_id = m.id
                            ORDER BY ed.tanggal DESC";
                    $res = mysqli_query($conn, $sql);
                    $no = 1;
                    while ($row = mysqli_fetch_assoc($res)):
                        $rata = round(($row['nilai_pengajaran'] + $row['nilai_komunikasi'] + $row['nilai_kedisiplinan']) / 3, 1);
                    ?>
                    <tr>
                        <td><?= $no++ ?></td>
                        <td><strong><?= $row['dosen'] ?></strong></td>
                        <td><?= $row['mahasiswa'] ?></td>
                        <td><?= $row['npm'] ?></td>
                        <td><?= $row['semester'] ?></td>
                        <td><?= date('d-m-Y', strtotime($row['tanggal'])) ?></td>
                        <td><?= $rata ?> / 5</td>
                        <td><?= $row['komentar'] ?: '-' ?></td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
        <div class="wrapper">
            <span>2026 Universitas Gunadarma</span>
            <span>|</span>
            <span>Portal Evaluasi Dosen</span>
            <span>|</span>
            <span>BAAK - Gunadarma</span>
        </div>
    </div>
</body>
</html>
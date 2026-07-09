<?php
session_start();
if (!isset($_SESSION['role']) || $_SESSION['role'] != 'mahasiswa') {
    header("Location: ../index.php");
    exit();
}
require '../db.php';

$mhs_id = $_SESSION['user_id'];
$semester = "Ganjil 2025/2026";

// Ambil semua kelas yang tersedia 
$all_kelas_query = "SELECT * FROM kelas ORDER BY nama";
$all_kelas = mysqli_query($conn, $all_kelas_query);

// Proses ganti kelas
if (isset($_POST['ganti_kelas'])) {
    $kelas_baru = intval($_POST['kelas_id']); // Pastikan integer
    $_SESSION['kelas_id'] = $kelas_baru;
    header("Location: dashboard.php");
    exit();
}

// Ambil kelas dari session, kalo ga ada pake dari database
$kelas_id = $_SESSION['kelas_id'] ?? null;
if (!$kelas_id) {
    // Gunakan prepared statement untuk keamanan
    $sql_mhs = "SELECT kelas_id FROM mahasiswa WHERE id = ?";
    $stmt_mhs = mysqli_prepare($conn, $sql_mhs);
    mysqli_stmt_bind_param($stmt_mhs, "i", $mhs_id);
    mysqli_stmt_execute($stmt_mhs);
    $result_mhs = mysqli_stmt_get_result($stmt_mhs);
    $data_mhs = mysqli_fetch_assoc($result_mhs);
    $kelas_id = $data_mhs['kelas_id'] ?? 0;
    $_SESSION['kelas_id'] = $kelas_id;
}

// Ambil nama kelas dengan prepared statement
$kelas_nama = 'Belum pilih kelas';
if ($kelas_id > 0) {
    $sql_kelas = "SELECT nama FROM kelas WHERE id = ?";
    $stmt_kelas = mysqli_prepare($conn, $sql_kelas);
    mysqli_stmt_bind_param($stmt_kelas, "i", $kelas_id);
    mysqli_stmt_execute($stmt_kelas);
    $result_kelas = mysqli_stmt_get_result($stmt_kelas);
    $kelas_data = mysqli_fetch_assoc($result_kelas);
    $kelas_nama = $kelas_data['nama'] ?? 'Belum pilih kelas';
}

// Hitung total dosen di kelas yang dipilih dengan prepared statement
$total_dosen = 0;
if ($kelas_id > 0) {
    $sql_dosen = "SELECT COUNT(DISTINCT dosen_id) FROM pengampu_kelas WHERE kelas_id = ? AND semester = ?";
    $stmt_dosen = mysqli_prepare($conn, $sql_dosen);
    mysqli_stmt_bind_param($stmt_dosen, "is", $kelas_id, $semester);
    mysqli_stmt_execute($stmt_dosen);
    mysqli_stmt_bind_result($stmt_dosen, $total_dosen);
    mysqli_stmt_fetch($stmt_dosen);
    mysqli_stmt_close($stmt_dosen);
}

// Hitung sudah berapa dosen yang dievaluasi dengan prepared statement
$sudah_eval = 0;
$sql_eval = "SELECT COUNT(*) FROM evaluasi_dosen WHERE mahasiswa_id = ? AND semester = ?";
$stmt_eval = mysqli_prepare($conn, $sql_eval);
mysqli_stmt_bind_param($stmt_eval, "is", $mhs_id, $semester);
mysqli_stmt_execute($stmt_eval);
mysqli_stmt_bind_result($stmt_eval, $sudah_eval);
mysqli_stmt_fetch($stmt_eval);
mysqli_stmt_close($stmt_eval);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Mahasiswa</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f0f6;
            min-height: 100vh;
        }

        .wrapper {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .dashboard-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            border-top: 4px solid #4A154B;
            transition: all 0.3s;
            text-decoration: none;
            color: inherit;
        }

        .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(74, 21, 75, 0.12);
        }

        .dashboard-card .icon {
            font-size: 40px;
            margin-bottom: 10px;
        }

        .dashboard-card h3 {
            color: #4A154B;
            font-size: 16px;
        }

        .dashboard-card p {
            color: #999;
            font-size: 13px;
        }

        .dashboard-card .progress {
            margin-top: 12px;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
        }

        .progress-done {
            background: #e8f5e9;
            color: #2e7d32;
        }

        .progress-pending {
            background: #fff3e0;
            color: #e65100;
        }

        .kelas-badge {
            display: inline-block;
            background: #4A154B;
            color: white;
            padding: 4px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
        }

        .kelas-selector {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 8px;
        }

        .kelas-selector select {
            padding: 8px 14px;
            border: 2px solid #4A154B;
            border-radius: 8px;
            font-size: 14px;
            background: white;
            color: #4A154B;
            font-weight: 600;
        }

        .kelas-selector button {
            padding: 8px 20px;
            background: #4A154B;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.3s;
        }

        .kelas-selector button:hover {
            background: #6B206D;
        }

        .top-bar {
            background: linear-gradient(135deg, #4A154B 0%, #6B206D 100%);
            color: white;
            padding: 12px 0;
            border-bottom: 3px solid #c9a8cc;
            box-shadow: 0 2px 15px rgba(74, 21, 75, 0.2);
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .top-bar .wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }

        .top-bar .logo-area {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .top-bar .logo-area .logo-icon {
            font-size: 28px;
            background: white;
            color: #4A154B;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
        }

        .top-bar .logo-area .logo-text .univ-name {
            font-size: 10px;
            color: #c9a8cc;
            letter-spacing: 2px;
            font-weight: 300;
        }

        .top-bar .logo-area .logo-text .portal-name {
            font-size: 18px;
            font-weight: 700;
            color: white;
        }

        .top-bar .logo-area .logo-text .portal-name span {
            color: #c9a8cc;
        }

        .top-bar .user-menu {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .top-bar .user-menu .user-name {
            font-size: 13px;
            color: #c9a8cc;
        }

        .top-bar .user-menu .user-name strong {
            color: white;
        }

        .top-bar .user-menu .btn-logout {
            background: rgba(255,255,255,0.12);
            color: white;
            padding: 6px 18px;
            border-radius: 20px;
            text-decoration: none;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.3s;
            border: 1px solid rgba(255,255,255,0.08);
        }

        .top-bar .user-menu .btn-logout:hover {
            background: rgba(255,255,255,0.25);
            transform: scale(1.05);
        }

        .breadcrumb {
            background: white;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            margin-bottom: 25px;
        }

        .breadcrumb .wrapper {
            font-size: 13px;
            color: #999;
        }

        .breadcrumb .wrapper a {
            color: #4A154B;
            text-decoration: none;
            font-weight: 500;
        }

        .breadcrumb .wrapper a:hover {
            color: #6B206D;
            text-decoration: underline;
        }

        .breadcrumb .wrapper .separator {
            margin: 0 8px;
            color: #c9a8cc;
        }

        .footer {
            background: #4A154B;
            color: #c9a8cc;
            text-align: center;
            padding: 14px 0;
            margin-top: 40px;
            font-size: 12px;
            border-top: 3px solid #c9a8cc;
        }

        .footer .wrapper {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }

        .footer span {
            color: #c9a8cc;
        }

        .info-box {
            background: #f5f0f6;
            padding: 15px 20px;
            border-radius: 8px;
            border-left: 4px solid #4A154B;
            color: #555;
            font-size: 13px;
            margin-top: 20px;
        }

        .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
            margin-bottom: 30px;
        }

        .stat-box {
            background: white;
            padding: 20px 16px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            border-bottom: 3px solid #4A154B;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .stat-box:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(74, 21, 75, 0.1);
        }

        .stat-box .icon-stat {
            font-size: 24px;
            margin-bottom: 4px;
        }

        .stat-box .angka {
            font-size: 32px;
            font-weight: 700;
            color: #4A154B;
            line-height: 1.2;
        }

        .stat-box .label {
            color: #999;
            font-size: 12px;
            margin-top: 4px;
            font-weight: 500;
        }

        .welcome-card {
            background: white;
            padding: 24px 30px;
            border-radius: 12px;
            border-left: 5px solid #4A154B;
            margin-bottom: 25px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .welcome-card h2 {
            color: #4A154B;
            font-size: 20px;
        }

        .welcome-card p {
            color: #999;
            margin-top: 4px;
            font-size: 14px;
        }

        .icon-stat img {
            width: 45px;
            height: 45px;
            object-fit: contain;
        }

        .dashboard-card .icon img {
            width: 50px;
            height: 50px;
            object-fit: contain;
        }

        @media (max-width: 768px) {
            .top-bar .wrapper {
                flex-direction: column;
                text-align: center;
            }
            
            .top-bar .user-menu {
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .welcome-card {
                padding: 18px 20px;
            }
            
            .stat-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 480px) {
            .stat-grid {
                grid-template-columns: 1fr;
            }
            
            .kelas-selector {
                flex-direction: column;
                align-items: stretch;
            }
            
            .kelas-selector select {
                width: 100%;
            }
            
            .kelas-selector button {
                width: 100%;
            }
        }
    </style>
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
            <span class="user-name"><strong><?= $_SESSION['user_nama'] ?></strong> (Mahasiswa)</span>
            <a href="../logout.php" class="btn-logout">Keluar</a>
        </div>
    </div>
</div>

    <div class="breadcrumb">
        <div class="wrapper">
            <a href="dashboard.php">Dashboard</a>
            <span class="separator">›</span>
            <span>Mahasiswa</span>
        </div>
    </div>

    <div class="wrapper">
        <div class="welcome-card">
            <h2>Selamat Datang, <?= htmlspecialchars($_SESSION['user_nama']) ?> </h2>
            
            <div class="kelas-selector">
                <span style="font-weight:600; color:#4A154B;"> Pilih Kelas:</span>
                <form method="POST" style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                    <select name="kelas_id">
                        <?php while ($k = mysqli_fetch_assoc($all_kelas)): ?>
                            <option value="<?= $k['id'] ?>" <?= $k['id'] == $kelas_id ? 'selected' : '' ?>>
                                <?= htmlspecialchars($k['nama']) ?> (<?= htmlspecialchars($k['semester']) ?> <?= htmlspecialchars($k['tahun_akademik']) ?>)
                            </option>
                        <?php endwhile; ?>
                    </select>
                    <button type="submit" name="ganti_kelas">Ganti Kelas</button>
                </form>
            </div>
            <p style="margin-top:8px; color:#888; font-size:13px;">
                Evaluasi dosen yang mengajar di kelas <strong><?= htmlspecialchars($kelas_nama) ?></strong>.
            </p>
        </div>

        <div class="stat-grid">
            <div class="stat-box">
                <div class="icon-stat">
                    <img src="../assets/evaluasi.png" alt="Evaluasi">
                </div>
                <div class="angka"><?= $sudah_eval ?>/<?= $total_dosen ?></div>
                <div class="label">Evaluasi Dosen</div>
            </div>
            <div class="stat-box">
                <div class="icon-stat">
                    <img src="../assets/dosen3.png" alt="Dosen">
                </div>
                <div class="angka"><?= $total_dosen ?></div>
                <div class="label">Total Dosen di Kelas</div>
            </div>
        </div>

        <div class="dashboard-grid">
            <a href="evaluasi_dosen.php" class="dashboard-card">
                <div class="icon">
                    <img src="../assets/evaluasi.png" alt="Evaluasi Dosen">
                </div>
                <h3>Evaluasi Dosen</h3>
                <p>Nilai dosen pengampu di kelas Anda</p>
                <span class="progress <?= $sudah_eval >= $total_dosen && $total_dosen > 0 ? 'progress-done' : 'progress-pending' ?>">
                    <?php if ($total_dosen > 0): ?>
                        <?= $sudah_eval >= $total_dosen ? '✅ Selesai' : '⏳ ' . ($total_dosen - $sudah_eval) . ' tersisa' ?>
                    <?php else: ?>
                        Belum ada dosen
                    <?php endif; ?>
                </span>
            </a>
        </div>

        <div class="info-box">
            <strong>Info:</strong> Ganti kelas untuk melihat dosen yang berbeda. 
            Evaluasi yang sudah diisi tetap tersimpan.
        </div>
    </div>

    <div class="footer">
        <div class="wrapper">
            <span>© 2026 Universitas Gunadarma</span>
            <span>|</span>
            <span>Portal Evaluasi Dosen</span>
            <span>|</span>
            <span>BAAK - Gunadarma</span>
        </div>
    </div>
</body>
</html>
<?php
session_start();
if (!isset($_SESSION['role']) || $_SESSION['role'] != 'mahasiswa') {
    header("Location: ../index.php");
    exit();
}
require '../db.php';

$sukses = $error = "";
$mhs_id = $_SESSION['user_id'];
$kelas_id = $_SESSION['kelas_id'];
$semester = "Ganjil 2025/2026";

// Ambil dosen berdasarkan kelas di session
$dosen_list = mysqli_query($conn, "SELECT 
    d.id as dosen_id,
    d.nama as dosen,
    d.nidn,
    GROUP_CONCAT(DISTINCT mk.nama SEPARATOR ', ') as matakuliah,
    GROUP_CONCAT(DISTINCT mk.kode SEPARATOR ', ') as kode_matkul
FROM pengampu_kelas pk
JOIN dosen d ON pk.dosen_id = d.id
JOIN matakuliah mk ON pk.matkul_id = mk.id
WHERE pk.kelas_id = $kelas_id AND pk.semester = '$semester'
GROUP BY d.id
ORDER BY d.nama");

// Ambil pertanyaan
$pertanyaan = mysqli_query($conn, "SELECT * FROM setting_evaluasi WHERE kategori='dosen' AND aktif=1 ORDER BY id");

// Proses submit evaluasi
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $dosen_id = $_POST['dosen_id'];
    
    $nilai = [];
    while ($p = mysqli_fetch_assoc($pertanyaan)) {
        $nilai[$p['id']] = $_POST['nilai_' . $p['id']];
    }
    
    $komentar = trim($_POST['komentar']);

    // Cek apakah dosen ini mengajar di kelas yang dipilih
    $cek_dosen = mysqli_query($conn, "SELECT * FROM pengampu_kelas 
        WHERE dosen_id = $dosen_id AND kelas_id = $kelas_id AND semester = '$semester'");
    
    if (mysqli_num_rows($cek_dosen) == 0) {
        $error = "Dosen ini tidak mengajar di kelas yang Anda pilih.";
    } else {
        // Cek sudah evaluasi atau belum
        $cek_eval = mysqli_query($conn, "SELECT id FROM evaluasi_dosen 
            WHERE mahasiswa_id = $mhs_id AND dosen_id = $dosen_id AND semester = '$semester'");
        
        if (mysqli_num_rows($cek_eval) > 0) {
            $error = "Kamu sudah mengisi evaluasi untuk dosen ini di semester $semester.";
        } else {
            $n1 = $nilai[1] ?? 3;
            $n2 = $nilai[2] ?? 3;
            $n3 = $nilai[3] ?? 3;
            
            $sql = "INSERT INTO evaluasi_dosen 
                (mahasiswa_id, dosen_id, semester, nilai_pengajaran, nilai_komunikasi, nilai_kedisiplinan, komentar)
                VALUES ($mhs_id, $dosen_id, '$semester', $n1, $n2, $n3, '$komentar')";
            
            if (mysqli_query($conn, $sql)) {
                $sukses = " Evaluasi berhasil disimpan. Terima kasih!";
            } else {
                $error = "Terjadi kesalahan: " . mysqli_error($conn);
            }
        }
    }
}

mysqli_data_seek($pertanyaan, 0);
$total_dosen = mysqli_num_rows($dosen_list);
$kelas_data = mysqli_fetch_assoc(mysqli_query($conn, "SELECT nama FROM kelas WHERE id = $kelas_id"));
$kelas_nama = $kelas_data['nama'] ?? 'Belum pilih kelas';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Evaluasi Dosen - Mahasiswa</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .form-box {
            background: white;
            padding: 30px 35px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .form-box h2 {
            color: #4A154B;
            margin-bottom: 18px;
            border-bottom: 3px solid #e8d5e8;
            padding-bottom: 10px;
            font-size: 20px;
        }
        .form-box label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #4A154B;
            margin: 14px 0 6px;
        }
        .form-box select,
        .form-box textarea {
            width: 100%;
            padding: 10px 14px;
            border: 2px solid #eee;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.3s;
            background: #faf8fb;
        }
        .form-box select:focus,
        .form-box textarea:focus {
            border-color: #4A154B;
            outline: none;
            background: white;
        }
        .form-box textarea {
            resize: vertical;
            min-height: 80px;
        }
        .form-box .info-box {
            background: #f5f0f6;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 13px;
            border-left: 4px solid #4A154B;
            color: #555;
        }
        .form-box .alert-success {
            background: #e8f5e9;
            color: #2e7d32;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            border-left: 4px solid #2e7d32;
            font-weight: 500;
        }
        .form-box .alert-danger {
            background: #fde8e8;
            color: #c0392b;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            border-left: 4px solid #c0392b;
            font-weight: 500;
        }
        .form-box .btn-primary {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #4A154B, #6B206D);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s;
        }
        .form-box .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(74, 21, 75, 0.25);
        }
        .rating-group {
            display: flex;
            gap: 10px;
            margin-top: 5px;
            flex-wrap: wrap;
        }
        .rating-group label {
            flex: 1;
            text-align: center;
            margin: 0;
            padding: 10px 8px;
            border: 2px solid #eee;
            border-radius: 8px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 700;
            min-width: 38px;
            transition: all 0.3s;
            background: #faf8fb;
            color: #888;
        }
        .rating-group label:hover {
            border-color: #4A154B;
            background: #f0ecf1;
            transform: scale(1.05);
        }
        .rating-group input[type="radio"] {
            display: none;
        }
        .rating-group input[type="radio"]:checked+label {
            background: linear-gradient(135deg, #4A154B, #6B206D);
            color: white;
            border-color: #4A154B;
            box-shadow: 0 4px 15px rgba(74, 21, 75, 0.25);
        }
        .btn-back {
            display: inline-block;
            color: #4A154B;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 16px;
        }
        .btn-back:hover {
            color: #6B206D;
            text-decoration: underline;
        }
        .kelas-badge {
            display: inline-block;
            background: #4A154B;
            color: white;
            padding: 2px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
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
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
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
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
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
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }
        .footer span {
            color: #c9a8cc;
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
                    <span class="portal-name">Portal <span>Evaluasi</span></span>
                </div>
            </div>
            <div class="user-menu">
                <span class="user-name"> <strong><?= $_SESSION['user_nama'] ?></strong> (Mahasiswa)</span>
                <a href="../logout.php" class="btn-logout">Keluar</a>
            </div>
        </div>
    </div>

    <div class="breadcrumb">
        <div class="wrapper">
            <a href="dashboard.php">Dashboard</a>
            <span class="separator">›</span>
            <span>Evaluasi Dosen</span>
        </div>
    </div>

    <div class="wrapper" style="max-width:700px; margin:0 auto; padding:0 20px;">
        <a href="dashboard.php" class="btn-back">← Kembali ke Dashboard</a>

        <div class="form-box">
            <h2> Form Evaluasi Dosen</h2>

            <?php if ($sukses): ?>
                <div class="alert-success"> <?= $sukses ?></div>
            <?php endif; ?>
            <?php if ($error): ?>
                <div class="alert-danger"> <?= $error ?></div>
            <?php endif; ?>

            <div class="info-box">
                 <strong>Kelas Anda:</strong> <span class="kelas-badge"><?= $kelas_nama ?></span>
                <br>
                💡 Hanya dosen yang mengajar di kelas ini yang muncul di bawah.
            </div>

            <?php if ($total_dosen == 0): ?>
                <div class="alert-danger">
                     Belum ada dosen yang terdaftar untuk kelas ini.
                    <br>Silakan pilih kelas lain atau hubungi administrator.
                </div>
            <?php else: ?>

            <form method="POST">
                <label> Pilih Dosen</label>
                <select name="dosen_id" required>
                    <option value="">-- Pilih Dosen --</option>
                    <?php while ($d = mysqli_fetch_assoc($dosen_list)): 
                        $cek = mysqli_query($conn, "SELECT id FROM evaluasi_dosen 
                            WHERE mahasiswa_id = $mhs_id AND dosen_id = {$d['dosen_id']} AND semester = '$semester'");
                        $sudah = mysqli_num_rows($cek) > 0;
                    ?>
                        <option value="<?= $d['dosen_id'] ?>" <?= $sudah ? 'disabled style="color:#999;"' : '' ?>>
                            <?= $d['dosen'] ?> 
                            (<?= $d['nidn'] ?>)
                            - <?= $d['matakuliah'] ?>
                            <?= $sudah ? ' (Sudah)' : '' ?>
                        </option>
                    <?php endwhile; ?>
                </select>

                <label> Semester</label>
                <input type="text" value="<?= $semester ?>" disabled style="background:#f5f0f6; padding:10px 14px; border-radius:8px; border:2px solid #eee; width:100%;">

                <?php while ($p = mysqli_fetch_assoc($pertanyaan)): ?>
                <label> <?= $p['pertanyaan'] ?> (1-5)</label>
                <div class="rating-group">
                    <?php for ($i = 1; $i <= 5; $i++): ?>
                        <input type="radio" name="nilai_<?= $p['id'] ?>" id="q<?= $p['id'] ?>_<?= $i ?>" value="<?= $i ?>" required>
                        <label for="q<?= $p['id'] ?>_<?= $i ?>"><?= $i ?></label>
                    <?php endfor; ?>
                </div>
                <?php endwhile; ?>

                <label> Komentar / Saran (opsional)</label>
                <textarea name="komentar" rows="4" placeholder="Tuliskan komentar atau saran kamu..."></textarea>

                <button type="submit" class="btn-primary">Kirim Evaluasi</button>
            </form>
            <?php endif; ?>
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
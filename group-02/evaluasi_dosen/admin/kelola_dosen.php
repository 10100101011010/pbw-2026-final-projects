<?php
session_start();
if (!isset($_SESSION['role']) || $_SESSION['role'] != 'admin') {
    header("Location: ../index.php");
    exit();
}
require '../db.php';

if (isset($_POST['tambah'])) {
    $nidn = $_POST['nidn'];
    $nama = $_POST['nama'];
    $departemen = $_POST['departemen'];
    mysqli_query($conn, "INSERT INTO dosen (nidn, nama, departemen) VALUES ('$nidn', '$nama', '$departemen')");
    header("Location: kelola_dosen.php");
    exit();
}

if (isset($_POST['edit'])) {
    $id = $_POST['id'];
    $nidn = $_POST['nidn'];
    $nama = $_POST['nama'];
    $departemen = $_POST['departemen'];
    mysqli_query($conn, "UPDATE dosen SET nidn='$nidn', nama='$nama', departemen='$departemen' WHERE id=$id");
    header("Location: kelola_dosen.php");
    exit();
}

if (isset($_GET['hapus'])) {
    $id = $_GET['hapus'];
    mysqli_query($conn, "DELETE FROM dosen WHERE id=$id");
    header("Location: kelola_dosen.php");
    exit();
}

$data = mysqli_query($conn, "SELECT * FROM dosen ORDER BY nama");
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kelola Dosen - Admin</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .form-inline {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
        }
        .form-inline input {
            padding: 8px 12px;
            border: 2px solid #F0EEF1;
            border-radius: 6px;
            font-size: 13px;
            background: #F8F6FA;
        }
        .form-inline input:focus {
            border-color: #4A154B;
            outline: none;
        }
        .form-inline button {
            padding: 8px 20px;
            background: #4A154B;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
        .form-inline button:hover {
            background: #6B206D;
        }
        .btn-edit {
            background: #f39c12;
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 12px;
        }
        .btn-hapus {
            background: #e74c3c;
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 12px;
        }
        .btn-edit:hover, .btn-hapus:hover {
            opacity: 0.8;
        }
        .modal {
            display: <?= isset($_GET['edit']) ? 'block' : 'none' ?>;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        }
        .modal-content {
            background: white;
            max-width: 500px;
            margin: 80px auto;
            padding: 30px;
            border-radius: 12px;
        }
        .modal-content h3 {
            color: #4A154B;
            margin-bottom: 20px;
        }
        .modal-content input {
            width: 100%;
            padding: 10px;
            margin: 8px 0;
            border: 2px solid #F0EEF1;
            border-radius: 6px;
        }
        .modal-content input:focus {
            border-color: #4A154B;
            outline: none;
        }
        .modal-content button {
            padding: 10px 30px;
            background: #4A154B;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 10px;
        }
        .modal-content button:hover {
            background: #6B206D;
        }
        .modal-content .close {
            float: right;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }
        .modal-content .close:hover {
            color: #333;
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
            font-size: 22px;
            font-weight: 900;
            background: white;
            color: #4A154B;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Times New Roman', serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
        .top-bar .logo-area .logo-text .univ-name {
            font-size: 11px;
            color: #c9a8cc;
            letter-spacing: 2px;
            font-weight: 300;
        }
        .top-bar .logo-area .logo-text .portal-name {
            font-size: 16px;
            font-weight: 700;
            color: white;
            letter-spacing: 0.5px;
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
        .page-title {
            margin-bottom: 25px;
        }
        .page-title h2 {
            color: #4A154B;
            font-size: 24px;
            font-weight: 700;
        }
        .page-title p {
            color: #999;
            font-size: 14px;
            margin-top: 4px;
        }
        .form-box {
            background: white;
            padding: 30px 35px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .form-box h3 {
            color: #4A154B;
            font-size: 17px;
        }
        .table-wrapper {
            background: white;
            border-radius: 12px;
            overflow-x: auto;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .table-wrapper table {
            width: 100%;
            border-collapse: collapse;
            min-width: 500px;
        }
        .table-wrapper thead {
            background: linear-gradient(135deg, #4A154B, #6B206D);
        }
        .table-wrapper th {
            color: white;
            padding: 12px 16px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .table-wrapper td {
            padding: 12px 16px;
            font-size: 13px;
            border-bottom: 1px solid #f0eef1;
        }
        .table-wrapper tbody tr:hover {
            background: #f8f6fa;
        }
        .table-wrapper tbody tr:last-child td {
            border-bottom: none;
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
                <span class="user-name"><strong><?= $_SESSION['user_nama'] ?></strong> (Admin)</span>
                <a href="../logout.php" class="btn-logout">Keluar</a>
            </div>
        </div>
    </div>
    
    <div class="breadcrumb">
        <div class="wrapper">
            <a href="dashboard.php">Dashboard</a>
            <span class="separator">›</span>
            <span>Kelola Dosen</span>
        </div>
    </div>

    <div class="wrapper">
        <div class="page-title">
            <h2>Kelola Dosen</h2>
            <p>Tambah, edit, atau hapus data dosen</p>
        </div>

        <div class="form-box" style="margin-bottom: 30px;">
            <h3 style="color:#4A154B; margin-bottom:15px;">Tambah Dosen Baru</h3>
            <form method="POST" class="form-inline">
                <input type="text" name="nidn" placeholder="NIDN" required>
                <input type="text" name="nama" placeholder="Nama Dosen" required>
                <input type="text" name="departemen" placeholder="Jurusan" required>
                <button type="submit" name="tambah">Simpan</button>
            </form>
        </div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>NIDN</th>
                        <th>Nama Dosen</th>
                        <th>Jurusan</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $no = 1; while ($row = mysqli_fetch_assoc($data)): ?>
                    <tr>
                        <td><?= $no++ ?></td>
                        <td><?= $row['nidn'] ?></td>
                        <td><strong><?= $row['nama'] ?></strong></td>
                        <td><?= $row['departemen'] ?></td>
                        <td>
                            <a href="?edit=<?= $row['id'] ?>" class="btn-edit">Edit</a>
                            <a href="?hapus=<?= $row['id'] ?>" class="btn-hapus" onclick="return confirm('Yakin hapus?')">Hapus</a>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </div>

    <?php if (isset($_GET['edit'])): 
        $id = $_GET['edit'];
        $edit = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM dosen WHERE id=$id"));
    ?>
    <div class="modal">
        <div class="modal-content">
            <span class="close" onclick="window.location='kelola_dosen.php'">&times;</span>
            <h3>Edit Dosen</h3>
            <form method="POST">
                <input type="hidden" name="id" value="<?= $edit['id'] ?>">
                <label>NIDN</label>
                <input type="text" name="nidn" value="<?= $edit['nidn'] ?>" required>
                <label>Nama Dosen</label>
                <input type="text" name="nama" value="<?= $edit['nama'] ?>" required>
                <label>Jurusan</label>
                <input type="text" name="departemen" value="<?= $edit['departemen'] ?>" required>
                <button type="submit" name="edit">Update</button>
            </form>
        </div>
    </div>
    <?php endif; ?>

    <div class="footer">
        <div class="wrapper">
            <span>2026 Universitas Gunadarma</span>
            <span>|</span>
            <span>Portal Evaluasi Dosen &amp;</span>
            <span>|</span>
            <span>BAAK - Gunadarma</span>
        </div>
    </div>
</body>
</html>
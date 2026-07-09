<?php
session_start();
if (!isset($_SESSION['role']) || $_SESSION['role'] != 'admin') {
    header("Location: ../index.php");
    exit();
}
require '../db.php';

if (isset($_POST['tambah'])) {
    $npm = $_POST['npm'];
    $nama = $_POST['nama'];
    $password = MD5($_POST['password']);
    $semester = $_POST['semester'];
    mysqli_query($conn, "INSERT INTO mahasiswa (npm, nama, password, semester) VALUES ('$npm', '$nama', '$password', '$semester')");
    header("Location: kelola_mahasiswa.php");
    exit();
}

if (isset($_POST['edit'])) {
    $id = $_POST['id'];
    $npm = $_POST['npm'];
    $nama = $_POST['nama'];
    $semester = $_POST['semester'];
    if (!empty($_POST['password'])) {
        $password = MD5($_POST['password']);
        mysqli_query($conn, "UPDATE mahasiswa SET npm='$npm', nama='$nama', password='$password', semester='$semester' WHERE id=$id");
    } else {
        mysqli_query($conn, "UPDATE mahasiswa SET npm='$npm', nama='$nama', semester='$semester' WHERE id=$id");
    }
    header("Location: kelola_mahasiswa.php");
    exit();
}

if (isset($_GET['hapus'])) {
    $id = $_GET['hapus'];
    mysqli_query($conn, "DELETE FROM mahasiswa WHERE id=$id");
    header("Location: kelola_mahasiswa.php");
    exit();
}

$data = mysqli_query($conn, "SELECT * FROM mahasiswa ORDER BY nama");
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kelola Mahasiswa - Admin</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .form-inline {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
        }
        .form-inline input, .form-inline select {
            padding: 8px 12px;
            border: 2px solid #F0EEF1;
            border-radius: 6px;
            font-size: 13px;
            background: #F8F6FA;
        }
        .form-inline input:focus, .form-inline select:focus {
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
        .modal-content input, .modal-content select {
            width: 100%;
            padding: 10px;
            margin: 8px 0;
            border: 2px solid #F0EEF1;
            border-radius: 6px;
        }
        .modal-content input:focus, .modal-content select:focus {
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
                <span class="user-name"> <strong><?= $_SESSION['user_nama'] ?></strong> (Admin)</span>
                <a href="../logout.php" class="btn-logout">Keluar</a>
            </div>
        </div>
    </div>

    <div class="breadcrumb">
        <div class="wrapper">
            <a href="dashboard.php">Dashboard</a>
            <span class="separator">›</span>
            <span>Kelola Mahasiswa</span>
        </div>
    </div>

    <div class="wrapper">
        <div class="page-title">
            <h2> Kelola Mahasiswa</h2>
            <p>Tambah, edit, atau hapus data mahasiswa</p>
        </div>

        <div class="form-box" style="margin-bottom: 30px;">
            <h3 style="color:#4A154B; margin-bottom:15px;">➕ Tambah Mahasiswa Baru</h3>
            <form method="POST" class="form-inline">
                <input type="text" name="npm" placeholder="NPM" required>
                <input type="text" name="nama" placeholder="Nama Mahasiswa" required>
                <input type="password" name="password" placeholder="Password" required>
                <select name="semester" required>
                    <option value="Ganjil 2024/2025">Ganjil 2024/2025</option>
                    <option value="Genap 2024/2025">Genap 2024/2025</option>
                    <option value="Ganjil 2025/2026" selected>Ganjil 2025/2026</option>
                </select>
                <button type="submit" name="tambah">Simpan</button>
            </form>
        </div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>NPM</th>
                        <th>Nama Mahasiswa</th>
                        <th>Semester</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $no = 1; while ($row = mysqli_fetch_assoc($data)): ?>
                    <tr>
                        <td><?= $no++ ?></td>
                        <td><strong><?= $row['npm'] ?></strong></td>
                        <td><?= $row['nama'] ?></td>
                        <td><?= $row['semester'] ?></td>
                        <td>
                            <a href="?edit=<?= $row['id'] ?>" class="btn-edit"> Edit</a>
                            <a href="?hapus=<?= $row['id'] ?>" class="btn-hapus" onclick="return confirm('Yakin hapus?')"> Hapus</a>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </div>

    <?php if (isset($_GET['edit'])): 
        $id = $_GET['edit'];
        $edit = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM mahasiswa WHERE id=$id"));
    ?>
    <div class="modal">
        <div class="modal-content">
            <span class="close" onclick="window.location='kelola_mahasiswa.php'">&times;</span>
            <h3> Edit Mahasiswa</h3>
            <form method="POST">
                <input type="hidden" name="id" value="<?= $edit['id'] ?>">
                <label>NPM</label>
                <input type="text" name="npm" value="<?= $edit['npm'] ?>" required>
                <label>Nama Mahasiswa</label>
                <input type="text" name="nama" value="<?= $edit['nama'] ?>" required>
                <label>Password (kosongkan jika tidak diubah)</label>
                <input type="password" name="password" placeholder="Password baru...">
                <label>Semester</label>
                <select name="semester" required>
                    <option value="Ganjil 2024/2025" <?= $edit['semester'] == 'Ganjil 2024/2025' ? 'selected' : '' ?>>Ganjil 2024/2025</option>
                    <option value="Genap 2024/2025" <?= $edit['semester'] == 'Genap 2024/2025' ? 'selected' : '' ?>>Genap 2024/2025</option>
                    <option value="Ganjil 2025/2026" <?= $edit['semester'] == 'Ganjil 2025/2026' ? 'selected' : '' ?>>Ganjil 2025/2026</option>
                </select>
                <button type="submit" name="edit">Update</button>
            </form>
        </div>
    </div>
    <?php endif; ?>

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
<?php
session_start();
if (!isset($_SESSION['role']) || $_SESSION['role'] != 'admin') {
    header("Location: ../index.php");
    exit();
}
require '../db.php';

if (isset($_POST['tambah'])) {
    $kategori = $_POST['kategori'];
    $pertanyaan = $_POST['pertanyaan'];
    mysqli_query($conn, "INSERT INTO setting_evaluasi (kategori, pertanyaan) VALUES ('$kategori', '$pertanyaan')");
    header("Location: kelola_pertanyaan.php");
    exit();
}

if (isset($_POST['edit'])) {
    $id = $_POST['id'];
    $pertanyaan = $_POST['pertanyaan'];
    mysqli_query($conn, "UPDATE setting_evaluasi SET pertanyaan='$pertanyaan' WHERE id=$id");
    header("Location: kelola_pertanyaan.php");
    exit();
}

if (isset($_GET['hapus'])) {
    $id = $_GET['hapus'];
    mysqli_query($conn, "DELETE FROM setting_evaluasi WHERE id=$id");
    header("Location: kelola_pertanyaan.php");
    exit();
}

if (isset($_GET['toggle'])) {
    $id = $_GET['toggle'];
    mysqli_query($conn, "UPDATE setting_evaluasi SET aktif = NOT aktif WHERE id=$id");
    header("Location: kelola_pertanyaan.php");
    exit();
}

$data = mysqli_query($conn, "SELECT * FROM setting_evaluasi ORDER BY kategori, id");
$total = mysqli_fetch_row(mysqli_query($conn, "SELECT COUNT(*) FROM setting_evaluasi"))[0];
$jml_dosen = mysqli_fetch_row(mysqli_query($conn, "SELECT COUNT(*) FROM setting_evaluasi WHERE kategori='dosen'"))[0];
$jml_matkul = mysqli_fetch_row(mysqli_query($conn, "SELECT COUNT(*) FROM setting_evaluasi WHERE kategori='matkul'"))[0];
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kelola Pertanyaan - Admin</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .toolbar {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
            margin-bottom: 20px;
            padding: 14px 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .toolbar .search-box {
            display: flex;
            gap: 8px;
            width: 100%;
        }
        .toolbar .search-box input {
            flex: 1;
            padding: 8px 14px;
            border: 2px solid #F0EEF1;
            border-radius: 6px;
            font-size: 13px;
            background: #F8F6FA;
        }
        .toolbar .search-box input:focus {
            border-color: #4A154B;
            outline: none;
            background: white;
        }
        .toolbar .search-box button {
            padding: 8px 20px;
            background: #4A154B;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }
        .toolbar .search-box button:hover {
            background: #6B206D;
        }
        .stat-info {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            margin-bottom: 15px;
            padding: 10px 0;
        }
        .stat-info .total {
            font-size: 13px;
            color: #888;
        }
        .stat-info .total strong {
            color: #4A154B;
            font-size: 17px;
        }
        .stat-info .badge-count {
            display: inline-block;
            padding: 3px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
        }
        .badge-dosen-count {
            background: #F0EEF1;
            color: #4A154B;
        }
        .badge-matkul-count {
            background: #FFF3E0;
            color: #E65100;
        }
        .badge-kategori {
            display: inline-block;
            padding: 4px 14px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-dosen {
            background: #F0EEF1;
            color: #4A154B;
        }
        .badge-matkul {
            background: #FFF3E0;
            color: #E65100;
        }
        .badge-aktif {
            background: #E8F5E9;
            color: #2E7D32;
        }
        .badge-nonaktif {
            background: #FDF0F0;
            color: #C0392B;
        }
        .btn-tambah {
            padding: 10px 28px;
            background: linear-gradient(135deg, #4A154B, #6B206D);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s;
        }
        .btn-tambah:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(74, 21, 75, 0.25);
        }
        .table-pertanyaan {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
        }
        .table-pertanyaan thead {
            background: linear-gradient(135deg, #4A154B, #6B206D);
        }
        .table-pertanyaan th {
            color: white;
            padding: 13px 18px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
        }
        .table-pertanyaan td {
            padding: 13px 18px;
            font-size: 13px;
            border-bottom: 1px solid #F0EEF1;
        }
        .table-pertanyaan tbody tr:hover {
            background: #F8F6FA;
        }
        .table-pertanyaan .no {
            width: 50px;
            text-align: center;
            font-weight: 600;
            color: #999;
        }
        .dropdown-aksi {
            position: relative;
            display: inline-block;
        }
        .dropdown-aksi .btn-aksi {
            background: #4A154B;
            color: white;
            padding: 5px 14px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: background 0.3s;
        }
        .dropdown-aksi .btn-aksi:hover {
            background: #6B206D;
        }
        .dropdown-aksi .dropdown-menu {
            display: none;
            position: absolute;
            right: 0;
            top: 100%;
            margin-top: 4px;
            background: white;
            min-width: 150px;
            border-radius: 8px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
            z-index: 100;
            overflow: hidden;
            padding: 4px 0;
        }
        .dropdown-aksi .dropdown-menu.show {
            display: block;
        }
        .dropdown-aksi .dropdown-menu a {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 16px;
            text-decoration: none;
            color: #333;
            font-size: 12px;
            transition: background 0.2s;
            border: none;
            background: none;
            width: 100%;
            cursor: pointer;
            text-align: left;
        }
        .dropdown-aksi .dropdown-menu a:hover {
            background: #F8F6FA;
        }
        .dropdown-aksi .dropdown-menu a.danger {
            color: #C0392B;
        }
        .dropdown-aksi .dropdown-menu a.danger:hover {
            background: #FDF0F0;
        }
        .dropdown-aksi .dropdown-menu a.success:hover {
            background: #E8F5E9;
        }
        .dropdown-aksi .dropdown-menu a.warning:hover {
            background: #FFF8E1;
        }
        .modal {
            display: <?= isset($_GET['edit']) ? 'block' : 'none' ?>;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.4);
            z-index: 999;
            padding: 20px;
        }
        .modal-content {
            background: white;
            max-width: 520px;
            margin: 80px auto;
            padding: 32px 36px;
            border-radius: 14px;
            position: relative;
            box-shadow: 0 25px 60px rgba(0,0,0,0.2);
        }
        .modal-content h3 {
            color: #4A154B;
            margin-bottom: 18px;
            font-size: 19px;
        }
        .modal-content label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #4A154B;
            margin: 14px 0 5px;
        }
        .modal-content input, .modal-content select, .modal-content textarea {
            width: 100%;
            padding: 10px 14px;
            border: 2px solid #F0EEF1;
            border-radius: 8px;
            font-size: 14px;
            background: #F8F6FA;
        }
        .modal-content input:focus, .modal-content select:focus, .modal-content textarea:focus {
            border-color: #4A154B;
            outline: none;
            background: white;
        }
        .modal-content textarea {
            resize: vertical;
            min-height: 60px;
        }
        .modal-content .btn-simpan {
            padding: 11px 30px;
            background: linear-gradient(135deg, #4A154B, #6B206D);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 15px;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s;
        }
        .modal-content .btn-simpan:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(74, 21, 75, 0.2);
        }
        .modal-content .close {
            position: absolute;
            right: 18px;
            top: 14px;
            font-size: 26px;
            cursor: pointer;
            color: #AAA;
        }
        .modal-content .close:hover {
            color: #4A154B;
        }
        .wrapper {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
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
        .table-wrapper {
            background: white;
            border-radius: 12px;
            overflow: auto;
            box-shadow: 0 2px 12px rgba(0,0,0,0.04);
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
        @media (max-width: 768px) {
            .top-bar .wrapper {
                flex-direction: column;
                text-align: center;
            }
            .top-bar .logo-area {
                flex-direction: column;
                text-align: center;
            }
            .top-bar .user-menu {
                flex-direction: column;
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
            <span>Kelola Pertanyaan Evaluasi</span>
        </div>
    </div>

    <div class="wrapper">
        <div class="page-title">
            <h2> Kelola Pertanyaan Evaluasi</h2>
            <p>Atur pertanyaan yang muncul di form evaluasi dosen</p>
        </div>

        <div class="toolbar">
            <div class="search-box">
                <form method="GET" style="display:flex; gap:8px; width:100%;">
                    <input type="text" name="search" placeholder="Cari pertanyaan..." value="<?= isset($_GET['search']) ? htmlspecialchars($_GET['search']) : '' ?>">
                    <button type="submit">Cari</button>
                    <?php if (isset($_GET['search']) && $_GET['search'] != ''): ?>
                        <a href="kelola_pertanyaan.php" style="padding:8px 16px; background:#e74c3c; color:white; border-radius:6px; text-decoration:none; font-size:13px; font-weight:600;">Reset</a>
                    <?php endif; ?>
                </form>
            </div>
        </div>

        <div class="stat-info">
            <span class="total"> <strong>Total Data:</strong> <?= $total ?> Rekor</span>
            <span class="badge-count badge-dosen-count"> Dosen: <?= $jml_dosen ?></span>
            <span class="badge-count badge-matkul-count"> Matakuliah: <?= $jml_matkul ?></span>
        </div>

        <div style="margin-bottom: 25px;">
            <button class="btn-tambah" onclick="document.getElementById('modalTambah').style.display='block'">Tambah Pertanyaan</button>
        </div>

        <div class="table-wrapper">
            <table class="table-pertanyaan">
                <thead>
                    <tr>
                        <th class="no">No</th>
                        <th>Kategori</th>
                        <th>Pertanyaan</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $no = 1; while ($row = mysqli_fetch_assoc($data)): ?>
                    <tr>
                        <td class="no"><?= $no++ ?></td>
                        <td>
                            <span class="badge-kategori <?= $row['kategori'] == 'dosen' ? 'badge-dosen' : 'badge-matkul' ?>">
                                <?= $row['kategori'] == 'dosen' ? 'Dosen' : 'Matakuliah' ?>
                            </span>
                        </td>
                        <td><?= htmlspecialchars($row['pertanyaan']) ?></td>
                        <td>
                            <span class="badge-kategori <?= $row['aktif'] ? 'badge-aktif' : 'badge-nonaktif' ?>">
                                <?= $row['aktif'] ? 'Aktif' : 'Nonaktif' ?>
                            </span>
                        </td>
                        <td>
                            <div class="dropdown-aksi">
                                <button class="btn-aksi" onclick="toggleDropdown(this)">Aksi ▾</button>
                                <div class="dropdown-menu">
                                    <a href="?edit=<?= $row['id'] ?>" class="warning">Edit</a>
                                    <a href="?toggle=<?= $row['id'] ?>" class="success"><?= $row['aktif'] ? 'Nonaktifkan' : 'Aktifkan' ?></a>
                                    <a href="?hapus=<?= $row['id'] ?>" class="danger" onclick="return confirm('Yakin hapus?')">Hapus</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- MODAL TAMBAH -->
    <div id="modalTambah" class="modal" style="display:none;">
        <div class="modal-content">
            <span class="close" onclick="document.getElementById('modalTambah').style.display='none'">&times;</span>
            <h3>Tambah Pertanyaan Baru</h3>
            <form method="POST">
                <label>Kategori</label>
                <select name="kategori" required>
                    <option value="dosen">Dosen</option>
                    <option value="matkul">Matakuliah</option>
                </select>
                <label>Pertanyaan</label>
                <textarea name="pertanyaan" rows="3" placeholder="Masukkan pertanyaan evaluasi..." required></textarea>
                <button type="submit" name="tambah" class="btn-simpan">Simpan</button>
            </form>
        </div>
    </div>

    <!-- MODAL EDIT -->
    <?php if (isset($_GET['edit'])): 
        $id = $_GET['edit'];
        $edit = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM setting_evaluasi WHERE id=$id"));
    ?>
    <div class="modal">
        <div class="modal-content">
            <span class="close" onclick="window.location='kelola_pertanyaan.php'">&times;</span>
            <h3>Edit Pertanyaan</h3>
            <form method="POST">
                <input type="hidden" name="id" value="<?= $edit['id'] ?>">
                <label>Kategori</label>
                <select name="kategori" disabled style="background:#f5f5f5;">
                    <option value="dosen" <?= $edit['kategori'] == 'dosen' ? 'selected' : '' ?>>Dosen</option>
                    <option value="matkul" <?= $edit['kategori'] == 'matkul' ? 'selected' : '' ?>>Matakuliah</option>
                </select>
                <input type="hidden" name="kategori" value="<?= $edit['kategori'] ?>">
                <label>Pertanyaan</label>
                <textarea name="pertanyaan" rows="3" required><?= htmlspecialchars($edit['pertanyaan']) ?></textarea>
                <button type="submit" name="edit" class="btn-simpan">Update</button>
            </form>
        </div>
    </div>
    <?php endif; ?>

    <div class="footer">
        <div class="wrapper">
            <span>2026 Universitas Gunadarma</span>
            <span>|</span>
            <span>Portal Evaluasi Dosen &amp; Matakuliah</span>
            <span>|</span>
            <span>BAAK - Gunadarma</span>
        </div>
    </div>

    <script>
        function toggleDropdown(btn) {
            var dropdown = btn.parentElement;
            var menu = dropdown.querySelector('.dropdown-menu');
            document.querySelectorAll('.dropdown-menu.show').forEach(function(el) {
                if (el !== menu) el.classList.remove('show');
            });
            menu.classList.toggle('show');
        }
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.dropdown-aksi')) {
                document.querySelectorAll('.dropdown-menu.show').forEach(function(el) {
                    el.classList.remove('show');
                });
            }
        });
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        }
    </script>
</body>
</html>
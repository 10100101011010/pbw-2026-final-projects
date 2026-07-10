<?php
require_once __DIR__ . '/includes/functions.php';
requireMahasiswa();

$pdo = getKoneksi();
$mahasiswaId = $_SESSION['mahasiswa_id'];

$stmt = $pdo->prepare('SELECT * FROM mahasiswa WHERE id = ?');
$stmt->execute([$mahasiswaId]);
$mhs = $stmt->fetch();

$halamanAktif = 'profil';
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Profil Mahasiswa</title>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/includes/sidebar_mahasiswa.php'; ?>

    <div class="main-area">
        <div class="topbar">
            <h1>Profil Saya</h1>
        </div>

        <div class="page-content">
            <div style="max-width:560px;">
                <div id="pesan-box" class="pesan-alert"></div>

                <form id="form-profil-mahasiswa" enctype="multipart/form-data">
                    <div class="upload-foto-wrap">
                        <?php if (!empty($mhs['foto_profil'])): ?>
                            <img src="<?= htmlspecialchars($mhs['foto_profil']) ?>" alt="Foto Profil" class="avatar-foto-besar" id="preview-foto">
                        <?php else: ?>
                            <div class="avatar-inisial-besar" id="preview-foto-kosong"><?= strtoupper(substr($mhs['nama'], 0, 1)) ?></div>
                            <img src="" alt="Foto Profil" class="avatar-foto-besar hidden" id="preview-foto">
                        <?php endif; ?>
                        <div class="upload-foto-info">
                            <span id="info-format-foto" class="<?= !empty($mhs['foto_profil']) ? 'hidden' : '' ?>">Format JPG, PNG, atau WEBP. Maks. 2MB.<br></span>
                            <label for="foto_profil">Ganti Foto</label>
                            <input type="file" name="foto_profil" id="foto_profil" accept="image/jpeg,image/png,image/webp">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="nama">Nama Lengkap</label>
                        <input type="text" id="nama" name="nama" value="<?= htmlspecialchars($mhs['nama']) ?>" required>
                    </div>

                    <div class="form-group">
                        <label>NPM</label>
                        <input type="text" value="<?= htmlspecialchars($mhs['npm']) ?>" disabled style="background:#EEECF2; color:var(--teks-sekunder);">
                        <p class="hint">NPM tidak dapat diubah karena digunakan sebagai username login</p>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="kelas">Kelas</label>
                            <input type="text" id="kelas" name="kelas" value="<?= htmlspecialchars($mhs['kelas']) ?>" required>
                        </div>
                        <div class="form-group">
                            <label for="semester">Semester</label>
                            <select id="semester" name="semester" required>
                                <?php for ($i = 1; $i <= 8; $i++): ?>
                                    <option value="<?= $i ?>" <?= $mhs['semester'] == $i ? 'selected' : '' ?>>Semester <?= $i ?></option>
                                <?php endfor; ?>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="jurusan">Jurusan / Prodi</label>
                        <input type="text" id="jurusan" name="jurusan" value="<?= htmlspecialchars($mhs['jurusan']) ?>" required>
                    </div>

                    <div class="form-group">
                        <label for="email">Email Aktif</label>
                        <input type="email" id="email" name="email" value="<?= htmlspecialchars($mhs['email']) ?>" required>
                    </div>

                    <div class="form-group">
                        <label for="no_hp">Nomor HP Aktif</label>
                        <input type="tel" id="no_hp" name="no_hp" value="<?= htmlspecialchars($mhs['no_hp']) ?>" required>
                    </div>

                    <div class="divider"></div>

                    <p class="hint" style="margin-bottom:10px;">Kosongkan bagian di bawah jika tidak ingin mengganti password</p>
                    <div class="form-group">
                        <label for="password_baru">Password Baru</label>
                        <div class="input-eye-wrap">
                            <input type="password" id="password_baru" name="password_baru" placeholder="Minimal 6 karakter">
                            <button type="button" class="toggle-eye" data-target="password_baru">Lihat</button>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primer mt-16">Simpan Perubahan</button>
                </form>
            </div>
        </div>
    </div>
</div>

<script src="assets/js/common.js"></script>
<script src="assets/js/profil.js"></script>
</body>
</html>
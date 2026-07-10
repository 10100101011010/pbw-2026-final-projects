<?php
require_once __DIR__ . '/includes/functions.php';
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Daftar Akun Mahasiswa</title>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="auth-page">
    <div class="auth-brand">🎓 SIKUT</div>

    <div class="auth-form-wrap">
        <div class="auth-card" style="max-width:480px;">
            <a href="index.php" class="back-link">&larr; Kembali ke halaman utama</a>
            <h1>Daftar Akun Mahasiswa</h1>
            <p class="sub">Lengkapi data di bawah untuk membuat akun baru</p>

            <div id="pesan-box" class="pesan-alert"></div>

            <form id="form-register-mahasiswa">
                <div class="form-group">
                    <label for="nama">Nama Lengkap</label>
                    <input type="text" id="nama" name="nama" placeholder="Contoh: Muhammad Rizky" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="npm">NPM</label>
                        <input type="text" id="npm" name="npm" placeholder="21051xxx" required>
                    </div>
                    <div class="form-group">
                        <label for="kelas">Kelas</label>
                        <input type="text" id="kelas" name="kelas" placeholder="TI-4A" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="jurusan">Jurusan / Prodi</label>
                        <input type="text" id="jurusan" name="jurusan" placeholder="Teknik Informatika" required>
                    </div>
                    <div class="form-group">
                        <label for="semester">Semester</label>
                        <select id="semester" name="semester" required>
                            <option value="">Pilih semester</option>
                            <?php for ($i = 1; $i <= 8; $i++): ?>
                                <option value="<?= $i ?>">Semester <?= $i ?></option>
                            <?php endfor; ?>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="email">Email Aktif</label>
                    <input type="email" id="email" name="email" placeholder="namakamu@gmail.com" required>
                </div>

                <div class="form-group">
                    <label for="no_hp">Nomor HP Aktif</label>
                    <input type="tel" id="no_hp" name="no_hp" placeholder="08xxxxxxxxxx" required>
                </div>

                <div class="form-group">
                    <label for="password">Buat Password</label>
                    <div class="input-eye-wrap">
                        <input type="password" id="password" name="password" placeholder="Minimal 6 karakter" required>
                        <button type="button" class="toggle-eye" data-target="password">Lihat</button>
                    </div>
                </div>

                <button type="submit" class="btn btn-primer btn-block mt-16">Daftar Akun</button>
            </form>

            <p class="auth-footer-link">Sudah punya akun? <a href="login_mahasiswa.php">Masuk di sini</a></p>
        </div>
    </div>
</div>

<script src="assets/js/auth.js"></script>
</body>
</html>
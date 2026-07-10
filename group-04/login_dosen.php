<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login Dosen</title>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="auth-page">
    <div class="auth-brand">🎓 SIKUT</div>

    <div class="auth-form-wrap">
        <div class="auth-card">
            <a href="index.php" class="back-link">&larr; Kembali ke halaman utama</a>
            <h1>Login Dosen</h1>
            <p class="sub">Gunakan NIP dan password akun Anda untuk masuk</p>

            <div id="pesan-box" class="pesan-alert"></div>

            <form id="form-login-dosen">
                <div class="form-group">
                    <label for="nip">NIP (Nomor Induk Pegawai)</label>
                    <input type="text" id="nip" name="nip" placeholder="Contoh: 1985010120100xxxxx" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <div class="input-eye-wrap">
                        <input type="password" id="password" name="password" placeholder="Masukkan password" required>
                        <button type="button" class="toggle-eye" data-target="password">Lihat</button>
                    </div>
                </div>
                <button type="submit" class="btn btn-primer btn-block mt-16">Masuk</button>
            </form>

            <p class="auth-footer-link">Belum punya akun? <a href="register_dosen.php">Daftar sebagai dosen</a></p>
            <p class="auth-footer-link" style="margin-top:6px;">Mahasiswa? <a href="login_mahasiswa.php">Masuk di sini</a></p>
        </div>
    </div>
</div>

<script src="assets/js/auth.js"></script>
</body>
</html>

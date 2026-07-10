<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Daftar Akun Dosen</title>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="auth-page">
    <div class="auth-brand">🎓 SIKUT</div>

    <div class="auth-form-wrap">
        <div class="auth-card" style="max-width:480px;">
            <a href="index.php" class="back-link">&larr; Kembali ke halaman utama</a>
            <h1>Daftar Akun Dosen</h1>
            <p class="sub">Lengkapi data di bawah untuk membuat akun baru</p>

            <div id="pesan-box" class="pesan-alert"></div>

            <form id="form-register-dosen">
                <div class="form-group">
                    <label for="nama">Nama Lengkap (dengan gelar)</label>
                    <input type="text" id="nama" name="nama" placeholder="Contoh: Dr. Andi Prasetyo, M.Kom" required>
                </div>

                <div class="form-group">
                    <label for="nip">NIP</label>
                    <input type="text" id="nip" name="nip" placeholder="Contoh: 1985010120100xxxxx" required>
                </div>

                <div class="form-group">
                    <label for="email">Email Aktif</label>
                    <input type="email" id="email" name="email" placeholder="nama@kampus.ac.id" required>
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

            <p class="auth-footer-link">Sudah punya akun? <a href="login_dosen.php">Masuk di sini</a></p>
        </div>
    </div>
</div>

<script src="assets/js/auth.js"></script>
</body>
</html>
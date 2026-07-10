<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sistem Kumpul Tugas</title>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="landing">
    <div class="landing-top">
        <img src="assets/img/logosikut.png" alt="Logo SIKUT" class="logo-utama">
        <h3>Sikut-sikutan nyari muka di depan dosen? NO NO❌</h3>
        <h3>Pakai SIKUT biar tugas kelar tanpa drama? YES YES!!!</h3>
    </div>

    <div class="split-wrapper">
        <div class="split-divider"></div>

        <div class="split-panel panel-mahasiswa">
            <div class="icon-lingkaran">👩🏻‍🎓</div>
            <p>Kerjakan tugas, unggah jawaban, dan centang progress belajarmu sendiri</p>
            <div class="flex gap-12">
                <a href="login_mahasiswa.php" class="btn btn-putih">Login Mahasiswa</a>
            </div>
            <a href="register_mahasiswa.php" style="font-size:13px; opacity:.9; margin-top:4px;">Belum punya akun? Daftar di sini &rarr;</a>
        </div>

        <div class="split-panel panel-dosen">
            <div class="icon-lingkaran">👩🏻‍🏫</div>
            <p>Buat tugas, unggah materi, pantau pengumpulan, dan beri nilai mahasiswa</p>
            <div class="flex gap-12">
                <a href="login_dosen.php" class="btn btn-primer">Login Dosen</a>
            </div>
            <a href="register_dosen.php" style="font-size:13px; color:var(--teks-sekunder); margin-top:4px;">Belum punya akun? Daftar di sini &rarr;</a>
        </div>
    </div>
</div>

</body>
</html>
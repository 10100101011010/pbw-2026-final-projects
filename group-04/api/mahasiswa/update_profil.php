<?php
require_once __DIR__ . '/../../includes/functions.php';
requireMahasiswa();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$mahasiswaId = $_SESSION['mahasiswa_id'];

$nama     = bersihkan($_POST['nama'] ?? '');
$kelas    = bersihkan($_POST['kelas'] ?? '');
$jurusan  = bersihkan($_POST['jurusan'] ?? '');
$semester = (int) ($_POST['semester'] ?? 0);
$email    = bersihkan($_POST['email'] ?? '');
$no_hp    = bersihkan($_POST['no_hp'] ?? '');
$passwordBaru = $_POST['password_baru'] ?? '';

if ($nama === '' || $kelas === '' || $jurusan === '' || $semester <= 0 || $email === '' || $no_hp === '') {
    jsonResponse(['success' => false, 'message' => 'Semua kolom wajib diisi dengan lengkap!']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Alamat email tidak valid']);
}

if ($passwordBaru !== '' && strlen($passwordBaru) < 6) {
    jsonResponse(['success' => false, 'message' => 'Password baru minimal 6 karakter']);
}

// Proses unggah foto profil (opsional)
$kolomFoto = '';
$paramFoto = [];
if (!empty($_FILES['foto_profil']['name'])) {
    $file = $_FILES['foto_profil'];
    $tipeDiizinkan = ['image/jpeg', 'image/png', 'image/webp'];

    if (!in_array($file['type'], $tipeDiizinkan)) {
        jsonResponse(['success' => false, 'message' => 'Foto harus berformat JPG, PNG, atau WEBP.']);
    }
    if ($file['size'] > 2 * 1024 * 1024) {
        jsonResponse(['success' => false, 'message' => 'Ukuran foto maksimal 2MB.']);
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        jsonResponse(['success' => false, 'message' => 'Gagal mengunggah foto.']);
    }

    $ekstensi = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $namaAman = 'mhs_' . $mahasiswaId . '_' . time() . '.' . $ekstensi;
    $tujuan = __DIR__ . '/../../uploads/profil/' . $namaAman;

    if (!move_uploaded_file($file['tmp_name'], $tujuan)) {
        jsonResponse(['success' => false, 'message' => 'Gagal menyimpan foto ke server.']);
    }

    // Hapus foto lama supaya tidak menumpuk file yang tidak terpakai
    $stmtFotoLama = $pdo->prepare('SELECT foto_profil FROM mahasiswa WHERE id = ?');
    $stmtFotoLama->execute([$mahasiswaId]);
    $fotoLama = $stmtFotoLama->fetchColumn();
    if ($fotoLama && file_exists(__DIR__ . '/../../' . $fotoLama)) {
        @unlink(__DIR__ . '/../../' . $fotoLama);
    }

    $kolomFoto = ', foto_profil=?';
    $paramFoto = ['uploads/profil/' . $namaAman];
}

try {
    if ($passwordBaru !== '') {
        $hash = password_hash($passwordBaru, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE mahasiswa SET nama=?, kelas=?, jurusan=?, semester=?, email=?, no_hp=?, password=?$kolomFoto WHERE id=?");
        $stmt->execute(array_merge([$nama, $kelas, $jurusan, $semester, $email, $no_hp, $hash], $paramFoto, [$mahasiswaId]));
    } else {
        $stmt = $pdo->prepare("UPDATE mahasiswa SET nama=?, kelas=?, jurusan=?, semester=?, email=?, no_hp=?$kolomFoto WHERE id=?");
        $stmt->execute(array_merge([$nama, $kelas, $jurusan, $semester, $email, $no_hp], $paramFoto, [$mahasiswaId]));
    }
} catch (PDOException $e) {
    // Kalau kolom foto_profil belum ada di database, kasih pesan yang jelas
    // alih-alih error PHP mentah yang bikin JS gagal parse response.
    if (strpos($e->getMessage(), 'foto_profil') !== false) {
        jsonResponse(['success' => false, 'message' => 'Kolom foto_profil belum ada di database. Jalankan database/migration_foto_profil.sql terlebih dahulu.'], 500);
    }
    jsonResponse(['success' => false, 'message' => 'Gagal menyimpan perubahan ke database.'], 500);
}

$_SESSION['mahasiswa_nama'] = $nama;
if (!empty($paramFoto)) {
    $_SESSION['mahasiswa_foto'] = $paramFoto[0];
}

jsonResponse(['success' => true, 'message' => 'Profil berhasil diperbarui']);
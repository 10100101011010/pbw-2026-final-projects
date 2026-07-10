<?php
require_once __DIR__ . '/../../includes/functions.php';
requireDosen();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Metode tidak diizinkan!'], 405);
}

$pdo = getKoneksi();
$dosenId = $_SESSION['dosen_id'];

$namaMatkulArr = $_POST['nama_matkul'] ?? [];
$kodeMatkulArr = $_POST['kode_matkul'] ?? [];

$adaValid = false;
foreach ($namaMatkulArr as $n) {
    if (trim($n) !== '') { $adaValid = true; break; }
}
if (!$adaValid) {
    jsonResponse(['success' => false, 'message' => 'Isi minimal 1 nama mata kuliah!']);
}

$paletWarna = ['#7C3AED', '#9333EA', '#A855F7', '#6D28D9', '#8B5CF6'];

// Hitung berapa matkul yang sudah dimiliki dosen ini, untuk variasi warna kartu
$stmtHitung = $pdo->prepare('SELECT COUNT(*) AS total FROM matakuliah WHERE dosen_id = ?');
$stmtHitung->execute([$dosenId]);
$urutan = (int) $stmtHitung->fetch()['total'];

$stmtMatkul = $pdo->prepare('INSERT INTO matakuliah (kode_matkul, nama_matkul, sks, dosen_id, warna) VALUES (?, ?, 3, ?, ?)');
$jumlahDitambah = 0;

foreach ($namaMatkulArr as $i => $namaMk) {
    $namaMk = trim(bersihkan($namaMk));
    if ($namaMk === '') continue;

    $kodeMk = trim(bersihkan($kodeMatkulArr[$i] ?? ''));
    if ($kodeMk === '') {
        $kodeMk = 'MK' . strtoupper(substr(md5($namaMk . $dosenId . microtime()), 0, 5));
    }

    // Pastikan kode tidak bentrok dengan yang sudah ada (kode_matkul harus unik)
    $cekKode = $pdo->prepare('SELECT id FROM matakuliah WHERE kode_matkul = ?');
    $cekKode->execute([$kodeMk]);
    if ($cekKode->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Kode "' . $kodeMk . '" sudah dipakai mata kuliah lain! Gunakan kode lain']);
    }

    $warna = $paletWarna[$urutan % count($paletWarna)];
    $stmtMatkul->execute([$kodeMk, $namaMk, $dosenId, $warna]);
    $urutan++;
    $jumlahDitambah++;
}

if ($jumlahDitambah === 0) {
    jsonResponse(['success' => false, 'message' => 'Tidak ada mata kuliah yang ditambahkan']);
}

jsonResponse(['success' => true, 'message' => $jumlahDitambah . ' mata kuliah berhasil ditambahkan']);

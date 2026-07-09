<?php
/**
 * api: mengambil riwayat booking.
 * - kalau yang login mahasiswa -> hanya booking miliknya sendiri.
 * - kalau yang login admin -> semua booking dari semua mahasiswa.
 * dipakai di riwayat.php (mahasiswa) dan admin/konfirmasi.php (admin).
 * pakai "b.*" jadi kolom baru (no_hp, dibatalkan_oleh_admin) otomatis ikut
 * terbawa tanpa perlu ubah query ini lagi kalau ada kolom baru lagi nanti.
 * method: get
 *
 * lapisan: logic/api
 */
require_once '../config/database.php';
require_once '../includes/auth.php';
require_once '../includes/functions.php';

if (!isLoggedIn()) {
    jsonResponse(false, 'silakan login terlebih dahulu');
}

$db = (new Database())->getConnection();

if (isAdmin()) {
    $stmt = $db->query(
        "SELECT b.*, u.nama, u.npm, l.nama as nama_lapangan
         FROM booking b
         JOIN users u ON b.user_id = u.id
         JOIN lapangan l ON b.lapangan_id = l.id
         ORDER BY b.tanggal DESC, b.jam_mulai DESC"
    );
} else {
    $stmt = $db->prepare(
        "SELECT b.*, l.nama as nama_lapangan
         FROM booking b
         JOIN lapangan l ON b.lapangan_id = l.id
         WHERE b.user_id = ?
         ORDER BY b.tanggal DESC, b.jam_mulai DESC"
    );
    $stmt->execute([$_SESSION['user_id']]);
}

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
jsonResponse(true, 'ok', $data);

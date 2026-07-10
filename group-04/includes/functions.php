<?php
/**
 * SIKUT - Kumpulan Fungsi Bantuan
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../config/database.php';

// Mengirim response dalam format JSON lalu menghentikan eksekusi
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Membersihkan input dasar (hanya trim spasi)
function bersihkan($data) {
    return trim($data ?? '');
}

// Memastikan hanya mahasiswa yang login yang bisa akses halaman/API tertentu
function requireMahasiswa() {
    if (!isset($_SESSION['mahasiswa_id'])) {
        if (isApiRequest()) {
            jsonResponse(['success' => false, 'message' => 'Sesi berakhir, silakan login kembali'], 401);
        }
        header('Location: /login_mahasiswa.php');
        exit;
    }
}

// Memastikan hanya dosen yang login yang bisa akses halaman/API tertentu
function requireDosen() {
    if (!isset($_SESSION['dosen_id'])) {
        if (isApiRequest()) {
            jsonResponse(['success' => false, 'message' => 'Sesi berakhir, silakan login kembali'], 401);
        }
        header('Location: /login_dosen.php');
        exit;
    }
}

function isApiRequest() {
    return strpos($_SERVER['REQUEST_URI'] ?? '', '/api/') !== false;
}

// Format tanggal ke format Indonesia yang mudah dibaca
function formatTanggal($tanggal) {
    if (!$tanggal) return '-';
    $bulan = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    $ts = strtotime($tanggal);
    return date('d', $ts) . ' ' . $bulan[(int)date('n', $ts)] . ' ' . date('Y', $ts) . ' ' . date('H:i', $ts);
}

// Menghitung sisa waktu menuju tenggat, dipakai untuk badge status tugas
function statusTenggat($tenggat) {
    $sekarang = time();
    $batas = strtotime($tenggat);
    $selisihJam = ($batas - $sekarang) / 3600;

    if ($selisihJam < 0) {
        return ['label' => 'Lewat Tenggat', 'kelas' => 'badge-merah'];
    } elseif ($selisihJam <= 24) {
        return ['label' => 'Segera Berakhir', 'kelas' => 'badge-kuning'];
    } else {
        return ['label' => 'Masih Berjalan', 'kelas' => 'badge-hijau'];
    }
}

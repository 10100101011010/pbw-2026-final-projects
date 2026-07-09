<?php
/**
 * file ini mengurus semua hal yang berhubungan dengan sesi login (session).
 * wajib di-require di paling atas setiap halaman/api yang butuh cek status login.
 *
 * lapisan: lintas lapisan (dipakai di presentation maupun logic/api)
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * mengecek apakah user sedang login (ada session user_id).
 */
function isLoggedIn()
{
    return isset($_SESSION['user_id']);
}

/**
 * mengecek apakah user yang login berperan sebagai admin/petugas.
 */
function isAdmin()
{
    return isLoggedIn() && $_SESSION['role'] === 'admin';
}

/**
 * mengambil data ringkas user yang sedang login, atau null jika belum login.
 */
function currentUser()
{
    if (!isLoggedIn()) {
        return null;
    }
    return [
        'id'   => $_SESSION['user_id'],
        'nama' => $_SESSION['nama'],
        'npm'  => $_SESSION['npm'],
        'role' => $_SESSION['role'],
    ];
}

/**
 * memaksa user harus login dulu untuk mengakses halaman.
 * $root dipakai supaya redirect tetap benar walau halaman ada di dalam folder admin/.
 */
function requireLogin($root = '')
{
    if (!isLoggedIn()) {
        header("Location: " . $root . "login.php");
        exit();
    }
}

/**
 * memaksa user harus login sekaligus berperan sebagai admin.
 * kalau login tapi bukan admin, dilempar balik ke halaman utama.
 */
function requireAdmin($root = '')
{
    requireLogin($root);
    if (!isAdmin()) {
        header("Location: " . $root . "index.php");
        exit();
    }
}

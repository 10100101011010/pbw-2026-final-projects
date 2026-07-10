<?php
/**
 * SIKUT - Koneksi Database
 * Menggunakan PDO agar query lebih aman (prepared statement)
 */

define('DB_HOST', 'localhost');
define('DB_PORT', '3307'); // 
define('DB_NAME', 'sikutdb');
define('DB_USER', 'root');
define('DB_PASS', '');

function getKoneksi() {
    static $pdo = null;

    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode([
                'success' => false,
                'message' => 'Koneksi database gagal: ' . $e->getMessage()
            ]));
        }
    }

    return $pdo;
}
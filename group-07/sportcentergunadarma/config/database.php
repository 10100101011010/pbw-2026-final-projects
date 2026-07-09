<?php

date_default_timezone_set('Asia/Jakarta');

/**
 * file ini bertugas membuka koneksi ke database mysql menggunakan pdo.
 * semua file lain (api & halaman admin) memanggil class database ini
 * setiap kali butuh akses ke database, jadi konfigurasi cukup diubah
 * di satu tempat ini saja.
 *
 * lapisan: data (lapisan paling bawah di arsitektur 3 lapis, lihat arsitektur.md)
 */
class Database
{
    // ubah 4 baris di bawah ini sesuai konfigurasi mysql di komputer/hosting kamu
    private $host = "localhost";
    private $db_name = "sportcenter_db";
    private $username = "root";
    private $password = ""; // default xampp kosong

    public $conn;

    /**
     * membuka koneksi pdo ke database.
     * kalau gagal, langsung hentikan proses dan tampilkan pesan error
     * dalam format json supaya rapi dibaca oleh fetch() di javascript.
     */
    public function getConnection()
    {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode([
                "success" => false,
                "message" => "koneksi database gagal: " . $e->getMessage()
            ]));
        }
        return $this->conn;
    }
}

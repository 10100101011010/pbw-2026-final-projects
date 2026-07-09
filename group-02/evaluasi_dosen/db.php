<?php
// Server
$host = "localhost";
// Authentication
$user = "root";
$pass = "";
// Nama database
$db   = "portal_evaluasi";  

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}
?>
<?php

try {
    $pdo = new PDO(
        "mysql:host=127.0.0.1;port=3307;dbname=sikutdb;charset=utf8mb4",
        "root",
        ""
    );

    echo "✅ BERHASIL KONEKSI";
} catch (PDOException $e) {
    echo "<pre>";
    echo $e->getMessage();
}
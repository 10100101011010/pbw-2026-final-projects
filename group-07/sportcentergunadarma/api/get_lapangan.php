<?php
/**
 * api: mengambil daftar semua lapangan berstatus aktif.
 * dipanggil oleh index.php untuk menampilkan katalog lapangan.
 * method: get
 *
 * lapisan: logic/api
 */
require_once '../config/database.php';
require_once '../includes/functions.php';

$db = (new Database())->getConnection();
$stmt = $db->query("SELECT * FROM lapangan WHERE status = 'aktif' ORDER BY id ASC");
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

jsonResponse(true, 'ok', $data);

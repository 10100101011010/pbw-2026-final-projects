<?php
/**
 * menghancurkan session lalu mengarahkan kembali ke halaman login.
 *
 * lapisan: presentation (tapi tidak menampilkan html apapun, langsung redirect)
 */
require_once 'includes/auth.php';
$_SESSION = [];
session_destroy();
header('Location: login.php');
exit();

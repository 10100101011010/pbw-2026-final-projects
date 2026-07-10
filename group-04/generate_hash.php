<?php
// File bantu SEMENTARA untuk generate hash password yang valid.

$password = '123456';
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "Password asli : " . htmlspecialchars($password) . "<br>";
echo "Hash yang valid untuk di-paste ke schema.sql:<br>";
echo "<textarea style='width:100%; height:60px;'>" . $hash . "</textarea>";
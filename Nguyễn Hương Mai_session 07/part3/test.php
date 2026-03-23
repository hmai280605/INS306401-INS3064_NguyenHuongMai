<?php
require_once 'Database.php';

$db = Database::getInstance()->getConnection();

echo "Connected successfully!";
?>
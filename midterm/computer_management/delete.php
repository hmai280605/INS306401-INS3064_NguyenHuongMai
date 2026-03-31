<?php
require 'config.php';

$id = $_GET['id'];

$stmt = $pdo->prepare("DELETE FROM computers WHERE id=?");
$stmt->execute([$id]);

header("Location: dashboard.php");
?>
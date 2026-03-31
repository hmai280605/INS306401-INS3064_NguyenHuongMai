<?php
require 'config.php';

$id = $_GET['id'];

$stmt = $pdo->prepare("SELECT * FROM computers WHERE id=?");
$stmt->execute([$id]);
$c = $stmt->fetch();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $stmt = $pdo->prepare("UPDATE computers SET 
        computer_name=?, model=?, operating_system=?, processor=?, memory=?, available=?
        WHERE id=?");

    $stmt->execute([
        $_POST['computer_name'],
        $_POST['model'],
        $_POST['operating_system'],
        $_POST['processor'],
        $_POST['memory'],
        $_POST['available'],
        $id
    ]);

    header("Location: dashboard.php");
}
?>

<form method="POST">
    Name: <input name="computer_name" value="<?= $c['computer_name'] ?>"><br>
    Model: <input name="model" value="<?= $c['model'] ?>"><br>
    OS: <input name="operating_system" value="<?= $c['operating_system'] ?>"><br>
    CPU: <input name="processor" value="<?= $c['processor'] ?>"><br>
    RAM: <input name="memory" value="<?= $c['memory'] ?>"><br>
    Available:
    <select name="available">
        <option value="1" <?= $c['available'] ? 'selected' : '' ?>>Yes</option>
        <option value="0" <?= !$c['available'] ? 'selected' : '' ?>>Repair</option>
    </select><br>
    <button type="submit">Update</button>
</form>
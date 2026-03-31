<?php
require 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['computer_name'];
    $model = $_POST['model'];

    if ($name && $model) {
        $stmt = $pdo->prepare("INSERT INTO computers (computer_name, model, operating_system, processor, memory, available)
                               VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $name,
            $model,
            $_POST['operating_system'],
            $_POST['processor'],
            $_POST['memory'],
            $_POST['available']
        ]);
        header("Location: dashboard.php");
    } else {
        echo "Name & Model required!";
    }
}
?>

<form method="POST">
    Name: <input name="computer_name"><br>
    Model: <input name="model"><br>
    OS: <input name="operating_system"><br>
    CPU: <input name="processor"><br>
    RAM: <input name="memory" type="number"><br>
    Available:
    <select name="available">
        <option value="1">Yes</option>
        <option value="0">Repair</option>
    </select><br>
    <button type="submit">Save</button>
</form>
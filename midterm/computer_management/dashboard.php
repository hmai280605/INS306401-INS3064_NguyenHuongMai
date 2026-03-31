<?php
require 'config.php';

$search = "";
if (isset($_GET['search'])) {
    $search = $_GET['search'];
    $stmt = $pdo->prepare("SELECT * FROM computers WHERE computer_name LIKE ?");
    $stmt->execute(["%$search%"]);
} else {
    $stmt = $pdo->query("SELECT * FROM computers");
}
$computers = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Computer Dashboard</title>
    <style>
        body { font-family: Arial; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: center; }
        th { background: #007BFF; color: white; }
        a { text-decoration: none; margin: 0 5px; }
    </style>
</head>
<body>

<h2>Computer Lab Management</h2>

<form method="GET">
    <input type="text" name="search" placeholder="Search by name..." value="<?= $search ?>">
    <button type="submit">Search</button>
</form>

<br>
<a href="add.php">➕ Add New Computer</a>

<table>
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Model</th>
        <th>OS</th>
        <th>CPU</th>
        <th>RAM</th>
        <th>Status</th>
        <th>Actions</th>
    </tr>

    <?php foreach ($computers as $c): ?>
    <tr>
        <td><?= $c['id'] ?></td>
        <td><?= $c['computer_name'] ?></td>
        <td><?= $c['model'] ?></td>
        <td><?= $c['operating_system'] ?></td>
        <td><?= $c['processor'] ?></td>
        <td><?= $c['memory'] ?> GB</td>
        <td><?= $c['available'] ? 'Available' : 'Repair' ?></td>
        <td>
            <a href="edit.php?id=<?= $c['id'] ?>">✏ Edit</a>
            <a href="delete.php?id=<?= $c['id'] ?>" onclick="return confirm('Delete?')">🗑 Delete</a>
        </td>
    </tr>
    <?php endforeach; ?>
</table>

</body>
</html>
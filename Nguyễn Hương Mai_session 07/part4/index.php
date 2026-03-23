<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'Nguyễn Hương Mai_session 07/part3/Database.php';

$db = Database::getInstance()->getConnection();

$search = $_GET['search'] ?? '';
$category = $_GET['category'] ?? '';

// Lấy danh sách category cho dropdown
$categories = $db->query("SELECT * FROM categories")->fetchAll();

// Query sản phẩm
$sql = "
    SELECT 
        p.id,
        p.name,
        p.price,
        p.stock,
        c.category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1
";

$params = [];

// Search theo tên
if (!empty($search)) {
    $sql .= " AND p.name LIKE :search";
    $params[':search'] = "%$search%";
}

// Filter theo category
if (!empty($category)) {
    $sql .= " AND p.category_id = :category";
    $params[':category'] = $category;
}

$sql .= " ORDER BY p.id";

$stmt = $db->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Admin</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 30px;
        }
        h2 {
            margin-bottom: 20px;
        }
        form {
            margin-bottom: 20px;
        }
        input, select, button {
            padding: 8px;
            margin-right: 10px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            max-width: 900px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
        }
        th {
            background: #f2f2f2;
        }
        .low-stock {
            background: red;
            color: white;
        }
    </style>
</head>
<body>

<h2>Product Administration Dashboard</h2>

<form method="GET">
    <input
        type="text"
        name="search"
        placeholder="Search product name..."
        value="<?= htmlspecialchars($search) ?>"
    >

    <select name="category">
        <option value="">All Categories</option>
        <?php foreach ($categories as $cat): ?>
            <option value="<?= $cat['id'] ?>" <?= ($category == $cat['id']) ? 'selected' : '' ?>>
                <?= htmlspecialchars($cat['category_name']) ?>
            </option>
        <?php endforeach; ?>
    </select>

    <button type="submit">Filter</button>
</form>

<table>
    <thead>
        <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category Name</th>
            <th>Stock Level</th>
        </tr>
    </thead>
    <tbody>
        <?php if (count($products) > 0): ?>
            <?php foreach ($products as $p): ?>
                <tr class="<?= ($p['stock'] < 10) ? 'low-stock' : '' ?>">
                    <td><?= $p['id'] ?></td>
                    <td><?= htmlspecialchars($p['name']) ?></td>
                    <td><?= number_format($p['price'], 2) ?></td>
                    <td><?= htmlspecialchars($p['category_name'] ?? 'No category') ?></td>
                    <td><?= $p['stock'] ?></td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td colspan="5">No products found.</td>
            </tr>
        <?php endif; ?>
    </tbody>
</table>

</body>
</html>
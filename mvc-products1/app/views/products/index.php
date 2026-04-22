<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Danh sách sản phẩm</title>
</head>
<body>
    <h1>Danh sách sản phẩm</h1>

    <a href="/products/create">Tạo sản phẩm mới</a>

    <ul>
        <?php foreach ($products as $product): ?>
            <li>
                Tên: <?php echo htmlspecialchars($product['name']); ?> -
                Giá: <?php echo htmlspecialchars($product['price']); ?> USD
            </li>
        <?php endforeach; ?>
    </ul>
</body>
</html>
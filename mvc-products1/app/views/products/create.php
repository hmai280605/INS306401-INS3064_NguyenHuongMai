<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tạo sản phẩm</title>
</head>
<body>
    <h1>Tạo sản phẩm</h1>

    <form action="/products/create" method="POST">
        <div>
            <label>Tên sản phẩm:</label>
            <input type="text" name="name">
        </div>

        <div>
            <label>Giá sản phẩm:</label>
            <input type="number" name="price" step="0.01">
        </div>

        <button type="submit">Lưu</button>
    </form>

    <br>
    <a href="/products">Quay lại danh sách</a>
</body>
</html>
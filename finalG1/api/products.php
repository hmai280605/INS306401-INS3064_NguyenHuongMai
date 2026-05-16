<?php
session_start();
require_once __DIR__ . '/../config/db.php';
DB::requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':    getProducts();    break;
    case 'POST':   createProduct();  break;
    case 'PUT':    updateProduct();  break;
    case 'DELETE': deleteProduct();  break;
    default: DB::json(['error' => 'Method not allowed'], 405);
}

// ── GET all products ─────────────────────────────────────────
function getProducts(): void
{
    $db   = DB::connect();
    $rows = [];
    $res  = $db->query("SELECT * FROM products ORDER BY id ASC");
    while ($row = $res->fetch_assoc()) {
        $rows[] = fmtProduct($row);
    }
    $db->close();
    DB::json($rows);
}

// ── POST create ──────────────────────────────────────────────
function createProduct(): void
{
    $d = json_decode(file_get_contents('php://input'), true);
    if (!$d) DB::json(['error' => 'Invalid JSON'], 400);
    validateFields($d);

    $db   = DB::connect();
    $stmt = $db->prepare("SELECT id FROM products WHERE id = ?");
    $stmt->bind_param('s', $d['id']);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        $stmt->close(); $db->close();
        DB::json(['error' => "ID '{$d['id']}' already exists"], 409);
    }
    $stmt->close();

    [$imp, $sale, $orig, $whl, $stk, $disc, $colors] = extractNumericFields($d);

    $stmt = $db->prepare(
        "INSERT INTO products
         (id,barcode,product_name,variant,category,segment,size,unit,supplier,warehouse,
          import_price,sale_price,original_price,wholesale_price,stock,discount_percent,
          color_options,note,image)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    );
    // params: 10×s  5×i  1×d  3×s  → 'ssssssssssiiiiidsss'
    $stmt->bind_param(
        'ssssssssssiiiiidsss',
        $d['id'], $d['barcode'], $d['productName'], $d['variant'],
        $d['category'], $d['segment'], $d['size'], $d['unit'],
        $d['supplier'], $d['warehouse'],
        $imp, $sale, $orig, $whl, $stk, $disc,
        $colors, $d['note'], $d['image']
    );

    if (!$stmt->execute()) {
        $err = $db->error; $stmt->close(); $db->close();
        DB::json(['error' => 'DB error: ' . $err], 500);
    }
    $stmt->close();

    $eid = $db->real_escape_string($d['id']);
    $row = $db->query("SELECT * FROM products WHERE id = '$eid'")->fetch_assoc();
    $db->close();
    DB::json(fmtProduct($row), 201);
}

// ── PUT update ───────────────────────────────────────────────
function updateProduct(): void
{
    $id = $_GET['id'] ?? '';
    if (!$id) DB::json(['error' => 'Product ID required'], 400);

    $d = json_decode(file_get_contents('php://input'), true);
    if (!$d) DB::json(['error' => 'Invalid JSON'], 400);

    $db  = DB::connect();
    $eid = $db->real_escape_string($id);

    if ($db->query("SELECT id FROM products WHERE id = '$eid'")->num_rows === 0) {
        $db->close();
        DB::json(['error' => "Product '$id' not found"], 404);
    }

    [$imp, $sale, $orig, $whl, $stk, $disc, $colors] = extractNumericFields($d);

    $stmt = $db->prepare(
        "UPDATE products SET
         barcode=?,product_name=?,variant=?,category=?,segment=?,size=?,unit=?,
         supplier=?,warehouse=?,
         import_price=?,sale_price=?,original_price=?,wholesale_price=?,stock=?,discount_percent=?,
         color_options=?,note=?,image=?
         WHERE id=?"
    );
    // params: 9×s  5×i  1×d  3×s  1×s(id) → 'sssssssssiiiiidssss'
    $stmt->bind_param(
        'sssssssssiiiiidssss',
        $d['barcode'], $d['productName'], $d['variant'],
        $d['category'], $d['segment'], $d['size'], $d['unit'],
        $d['supplier'], $d['warehouse'],
        $imp, $sale, $orig, $whl, $stk, $disc,
        $colors, $d['note'], $d['image'],
        $id
    );

    if (!$stmt->execute()) {
        $err = $db->error; $stmt->close(); $db->close();
        DB::json(['error' => 'DB error: ' . $err], 500);
    }
    $stmt->close();

    $row = $db->query("SELECT * FROM products WHERE id = '$eid'")->fetch_assoc();
    $db->close();
    DB::json(fmtProduct($row));
}

// ── DELETE ───────────────────────────────────────────────────
function deleteProduct(): void
{
    $id = $_GET['id'] ?? '';
    if (!$id) DB::json(['error' => 'Product ID required'], 400);

    $db  = DB::connect();
    $eid = $db->real_escape_string($id);
    $res = $db->query("SELECT id, product_name FROM products WHERE id = '$eid'");

    if ($res->num_rows === 0) {
        $db->close();
        DB::json(['error' => "Product '$id' not found"], 404);
    }
    $p = $res->fetch_assoc();

    $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param('s', $id);
    $stmt->execute();
    $stmt->close(); $db->close();
    DB::json(['success' => true, 'message' => "Product '{$p['product_name']}' deleted"]);
}

// ── Helpers ──────────────────────────────────────────────────
function validateFields(array $d): void
{
    foreach (['id', 'barcode', 'productName', 'category', 'segment'] as $f) {
        if (empty($d[$f])) DB::json(['error' => "Field '$f' is required"], 400);
    }
}

/** @return array{int,int,int,int,int,float,string} */
function extractNumericFields(array $d): array
{
    return [
        (int)($d['importPrice']    ?? 0),
        (int)($d['salePrice']      ?? 0),
        (int)($d['originalPrice']  ?? 0),
        (int)($d['wholesalePrice'] ?? 0),
        (int)($d['stock']          ?? 0),
        (float)($d['discountPercent'] ?? 0),
        implode(',', (array)($d['colorOptions'] ?? [])),
    ];
}

function fmtProduct(array $row): array
{
    return [
        'id'             => $row['id'],
        'barcode'        => $row['barcode'],
        'productName'    => $row['product_name'],
        'variant'        => $row['variant'] ?? '',
        'category'       => $row['category'],
        'segment'        => $row['segment'],
        'size'           => $row['size'] ?? '',
        'unit'           => $row['unit'] ?? 'Piece',
        'supplier'       => $row['supplier'] ?? '',
        'warehouse'      => $row['warehouse'] ?? '',
        'importPrice'    => (int)$row['import_price'],
        'salePrice'      => (int)$row['sale_price'],
        'originalPrice'  => (int)$row['original_price'],
        'wholesalePrice' => (int)$row['wholesale_price'],
        'stock'          => (int)$row['stock'],
        'discountPercent'=> (float)$row['discount_percent'],
        'colorOptions'   => $row['color_options'] ? explode(',', $row['color_options']) : [],
        'note'           => $row['note'] ?? '',
        'image'          => $row['image'] ?? '',
    ];
}

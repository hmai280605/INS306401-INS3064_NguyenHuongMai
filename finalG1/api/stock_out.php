<?php
session_start();
require_once __DIR__ . '/../config/db.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $db = getDB();
    $result = $db->query("SELECT so.*, p.product_name FROM stock_out so LEFT JOIN products p ON so.product_id = p.id ORDER BY so.created_at DESC LIMIT 50");
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $db->close();
    jsonResponse($rows);
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $productId = trim($data['productId'] ?? '');
    $quantity  = (int)($data['quantity'] ?? 0);
    $purpose   = trim($data['purpose'] ?? 'Store allocation');

    if (!$productId || $quantity <= 0) {
        jsonResponse(['error' => 'productId and positive quantity required'], 400);
    }

    $db = getDB();
    $eid = $db->real_escape_string($productId);
    $check = $db->query("SELECT id, product_name, stock, warehouse FROM products WHERE id = '$eid'");
    if ($check->num_rows === 0) {
        $db->close();
        jsonResponse(['error' => "Product '$productId' not found"], 404);
    }
    $product = $check->fetch_assoc();

    if ($quantity > $product['stock']) {
        $db->close();
        jsonResponse(['error' => 'Not enough stock. Available: ' . $product['stock']], 400);
    }

    $today  = date('Y-m-d');
    $noteId = 'OUT' . date('YmdHis');
    $userId = $_SESSION['user_id'];
    $stmt = $db->prepare("INSERT INTO stock_out (note_id,product_id,warehouse,quantity,date,purpose,status,created_by) VALUES (?,?,?,?,?,?,'completed',?)");
    $stmt->bind_param('sssiiss', $noteId, $productId, $product['warehouse'], $quantity, $today, $purpose, $userId);
    $stmt->execute();
    $stmt->close();

    $newStock = $product['stock'] - $quantity;
    $db->query("UPDATE products SET stock = $newStock WHERE id = '$eid'");
    $db->close();

    jsonResponse(['success' => true, 'productName' => $product['product_name'], 'newStock' => $newStock]);
}

jsonResponse(['error' => 'Method not allowed'], 405);

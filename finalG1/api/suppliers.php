<?php
session_start();
require_once __DIR__ . '/../config/db.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $db = getDB();
    $result = $db->query("SELECT s.*, COUNT(p.id) AS product_count FROM suppliers s LEFT JOIN products p ON p.supplier = s.name GROUP BY s.id ORDER BY s.name ASC");
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $db->close();
    jsonResponse($rows);
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $name  = trim($data['name'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $email = trim($data['email'] ?? '');
    if (!$name) jsonResponse(['error' => 'Supplier name required'], 400);

    $db = getDB();
    $stmt = $db->prepare("INSERT INTO suppliers (name,phone,email) VALUES (?,?,?)");
    $stmt->bind_param('sss', $name, $phone, $email);
    if (!$stmt->execute()) {
        $stmt->close(); $db->close();
        jsonResponse(['error' => 'Supplier already exists or DB error'], 409);
    }
    $id = $db->insert_id;
    $stmt->close(); $db->close();
    jsonResponse(['id' => $id, 'name' => $name, 'phone' => $phone, 'email' => $email, 'status' => 'active', 'product_count' => 0], 201);
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'ID required'], 400);
    $db = getDB();
    $stmt = $db->prepare("DELETE FROM suppliers WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->close(); $db->close();
    jsonResponse(['success' => true]);
}

jsonResponse(['error' => 'Method not allowed'], 405);

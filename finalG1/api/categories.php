<?php
session_start();
require_once __DIR__ . '/../config/db.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $db = getDB();
    $result = $db->query("SELECT c.*, COUNT(p.id) AS product_count FROM categories c LEFT JOIN products p ON p.category = c.name GROUP BY c.id ORDER BY c.name ASC");
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $db->close();
    jsonResponse($rows);
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $name = trim($data['name'] ?? '');
    $desc = trim($data['description'] ?? '');
    if (!$name) jsonResponse(['error' => 'Category name required'], 400);

    $db = getDB();
    $stmt = $db->prepare("INSERT INTO categories (name, description) VALUES (?,?)");
    $stmt->bind_param('ss', $name, $desc);
    if (!$stmt->execute()) {
        $stmt->close(); $db->close();
        jsonResponse(['error' => 'Category already exists or DB error'], 409);
    }
    $id = $db->insert_id;
    $stmt->close(); $db->close();
    jsonResponse(['id' => $id, 'name' => $name, 'description' => $desc, 'status' => 'active'], 201);
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'ID required'], 400);
    $db = getDB();
    $stmt = $db->prepare("DELETE FROM categories WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->close(); $db->close();
    jsonResponse(['success' => true]);
}

jsonResponse(['error' => 'Method not allowed'], 405);

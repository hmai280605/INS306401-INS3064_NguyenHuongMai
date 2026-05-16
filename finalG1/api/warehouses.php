<?php
session_start();
require_once __DIR__ . '/../config/db.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $db = getDB();
    $result = $db->query("SELECT w.*, COALESCE(SUM(p.stock),0) AS total_stock, COUNT(p.id) AS product_count FROM warehouses w LEFT JOIN products p ON p.warehouse = w.name GROUP BY w.id ORDER BY w.name ASC");
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $db->close();
    jsonResponse($rows);
}

if ($method === 'PUT') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'ID required'], 400);
    $data = json_decode(file_get_contents('php://input'), true);
    $location = trim($data['location'] ?? '');
    $manager  = trim($data['manager'] ?? '');
    $status   = in_array($data['status'] ?? '', ['active','inactive']) ? $data['status'] : 'active';

    $db = getDB();
    $stmt = $db->prepare("UPDATE warehouses SET location=?,manager=?,status=? WHERE id=?");
    $stmt->bind_param('sssi', $location, $manager, $status, $id);
    $stmt->execute();
    $stmt->close(); $db->close();
    jsonResponse(['success' => true]);
}

jsonResponse(['error' => 'Method not allowed'], 405);

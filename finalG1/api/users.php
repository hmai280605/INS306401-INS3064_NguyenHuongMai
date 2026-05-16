<?php
session_start();
require_once __DIR__ . '/../config/db.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $db = getDB();
    $result = $db->query("SELECT id, username, name, email, role, status, created_at FROM users ORDER BY id ASC");
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $db->close();
    jsonResponse($rows);
}

if ($method === 'POST') {
    if ($_SESSION['role'] !== 'admin') jsonResponse(['error' => 'Admin only'], 403);
    $data = json_decode(file_get_contents('php://input'), true);
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';
    $name     = trim($data['name'] ?? '');
    $email    = trim($data['email'] ?? '');
    $role     = in_array($data['role'] ?? '', ['admin','manager','staff']) ? $data['role'] : 'staff';

    if (!$username || !$password || !$name) jsonResponse(['error' => 'username, password, name required'], 400);

    $hashed = password_hash($password, PASSWORD_BCRYPT);
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO users (username,password,name,email,role) VALUES (?,?,?,?,?)");
    $stmt->bind_param('sssss', $username, $hashed, $name, $email, $role);
    if (!$stmt->execute()) {
        $stmt->close(); $db->close();
        jsonResponse(['error' => 'Username already exists'], 409);
    }
    $id = $db->insert_id;
    $stmt->close(); $db->close();
    jsonResponse(['id' => $id, 'username' => $username, 'name' => $name, 'email' => $email, 'role' => $role, 'status' => 'active'], 201);
}

if ($method === 'DELETE') {
    if ($_SESSION['role'] !== 'admin') jsonResponse(['error' => 'Admin only'], 403);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'ID required'], 400);
    if ($id === (int)$_SESSION['user_id']) jsonResponse(['error' => 'Cannot delete yourself'], 400);
    $db = getDB();
    $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->close(); $db->close();
    jsonResponse(['success' => true]);
}

jsonResponse(['error' => 'Method not allowed'], 405);

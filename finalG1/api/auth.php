<?php
session_start();
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? '';

if ($action === 'login') {
    $data     = json_decode(file_get_contents('php://input'), true);
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';

    if (!$username || !$password) {
        DB::json(['error' => 'Username and password required'], 400);
    }

    $db   = DB::connect();
    $stmt = $db->prepare("SELECT id, username, password, name, role FROM users WHERE username = ? AND status = 'active'");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    $db->close();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id']  = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['name']     = $user['name'];
        $_SESSION['role']     = $user['role'];
        DB::json(['success' => true, 'name' => $user['name'], 'role' => $user['role']]);
    } else {
        DB::json(['error' => 'Invalid username or password'], 401);
    }
}

if ($action === 'logout') {
    session_destroy();
    DB::json(['success' => true]);
}

if ($action === 'check') {
    if (!empty($_SESSION['user_id'])) {
        DB::json(['authenticated' => true, 'name' => $_SESSION['name'], 'role' => $_SESSION['role']]);
    } else {
        DB::json(['authenticated' => false]);
    }
}

DB::json(['error' => 'Unknown action'], 400);

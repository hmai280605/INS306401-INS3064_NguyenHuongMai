<?php
declare(strict_types=1);
session_start();

function e(string $s): string {
  return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

const MAX_ATTEMPTS = 3;
const LOCK_SECONDS = 30;

// Demo tài khoản đúng
const DEMO_USER = 'admin';
const DEMO_PASS = '123456';

if (!isset($_SESSION['attempts'])) $_SESSION['attempts'] = 0;
if (!isset($_SESSION['locked_until'])) $_SESSION['locked_until'] = 0;

$now = time();
$locked = $now < (int)$_SESSION['locked_until'];
$remaining = $locked ? ((int)$_SESSION['locked_until'] - $now) : 0;

$message = '';
$isError = false;

$username = (string)($_POST['username'] ?? '');
$password = (string)($_POST['password'] ?? '');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if ($locked) {
    $message = "Bạn đang bị khóa. Thử lại sau {$remaining} giây.";
    $isError = true;
  } else {
    $u = trim($username);
    $p = (string)$password; // password không trim cũng được

    if ($u === '' || $p === '') {
      $message = 'Vui lòng nhập đầy đủ username và password.';
      $isError = true;
    } else {
      if ($u === DEMO_USER && $p === DEMO_PASS) {
        $_SESSION['attempts'] = 0;
        $_SESSION['locked_until'] = 0;
        $_SESSION['logged_in'] = true;
        $_SESSION['user'] = $u;

        $message = 'Đăng nhập thành công ✅';
        $isError = false;
      } else {
        $_SESSION['attempts']++;

        if ((int)$_SESSION['attempts'] >= MAX_ATTEMPTS) {
          $_SESSION['locked_until'] = time() + LOCK_SECONDS;
          $message = 'Sai quá số lần cho phép. Tài khoản bị khóa tạm thời.';
        } else {
          $left = MAX_ATTEMPTS - (int)$_SESSION['attempts'];
          $message = "Sai thông tin. Bạn còn {$left} lần thử.";
        }

        $isError = true;
      }
    }
  }
}

// Logout (optional)
if (isset($_GET['logout'])) {
  session_destroy();
  header('Location: login.php');
  exit;
}

$loggedIn = !empty($_SESSION['logged_in']);
?>
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Login with Counter</title>
  <style>
    body { font-family: system-ui, Arial; max-width: 720px; margin: 40px auto; padding: 0 16px; }
    .card { border:1px solid #ddd; border-radius: 12px; padding: 16px; }
    label { display:block; margin: 12px 0 6px; font-weight: 600; }
    input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 10px; }
    button { margin-top: 14px; padding: 10px 16px; border: 0; border-radius: 10px; cursor: pointer; }
    .msg { margin: 14px 0; padding: 12px; border-radius: 10px; }
    .err { background:#fff3f3; border:1px solid #ffcccc; }
    .ok  { background:#f0fff4; border:1px solid #b7f5c5; }
    .muted { color:#666; }
    a { text-decoration: none; }
  </style>
</head>
<body>
  <h1>Login with Counter</h1>

  <?php if ($message !== ''): ?>
    <div class="msg <?= $isError ? 'err' : 'ok' ?>">
      <?= e($message) ?>
      <?php if ($locked): ?>
        <div class="muted" style="margin-top:6px;">Còn lại: <?= (int)$remaining ?> giây</div>
      <?php endif; ?>
    </div>
  <?php endif; ?>

  <div class="card">
    <?php if ($loggedIn): ?>
      <p>Xin chào <strong><?= e((string)($_SESSION['user'] ?? '')) ?></strong> 🎉</p>
      <p class="muted">Attempts đã reset khi đăng nhập đúng.</p>
      <a href="login.php?logout=1">Đăng xuất</a>
    <?php else: ?>
      <form method="post" action="login.php" novalidate>
        <label for="username">Username</label>
        <input id="username" name="username" type="text" value="<?= e($username) ?>" <?= $locked ? 'disabled' : '' ?> />

        <label for="password">Password</label>
        <input id="password" name="password" type="password" <?= $locked ? 'disabled' : '' ?> />

        <button type="submit" <?= $locked ? 'disabled' : '' ?>>Đăng nhập</button>
      </form>

      <p class="muted" style="margin-top:12px;">
        Demo: <strong>admin</strong> / <strong>123456</strong> —
        Attempts: <?= (int)$_SESSION['attempts'] ?>/<?= MAX_ATTEMPTS ?>
      </p>
    <?php endif; ?>
  </div>
</body>
</html>

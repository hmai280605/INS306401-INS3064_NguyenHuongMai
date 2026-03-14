<?php
declare(strict_types=1);
session_start();

function e(string $s): string {
  return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

// Flash message (PRG)
$flash = (string)($_SESSION['flash'] ?? '');
unset($_SESSION['flash']);

// Default old values
$old = $_SESSION['old'] ?? ['name'=>'', 'email'=>'', 'message'=>''];
unset($_SESSION['old']);

$errors = $_SESSION['errors'] ?? [];
unset($_SESSION['errors']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = trim((string)($_POST['name'] ?? ''));
  $email = trim((string)($_POST['email'] ?? ''));
  $message = trim((string)($_POST['message'] ?? ''));

  $errs = [];

  if ($name === '') $errs[] = 'Họ tên không được để trống.';
  if ($email === '') $errs[] = 'Email không được để trống.';
  if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errs[] = 'Email không hợp lệ.';
  if ($message === '') $errs[] = 'Nội dung không được để trống.';
  if ($message !== '' && mb_strlen($message) < 10) $errs[] = 'Nội dung nên từ 10 ký tự trở lên.';

  if ($errs) {
    // Lưu lại để hiển thị sau redirect
    $_SESSION['errors'] = $errs;
    $_SESSION['old'] = ['name'=>$name, 'email'=>$email, 'message'=>$message];
    header('Location: contact_self.php');
    exit;
  }

  // Process (demo): ở thực tế có thể lưu DB / gửi mail
  $_SESSION['flash'] = "Gửi thành công ✅ Cảm ơn bạn, {$name}!";
  header('Location: contact_self.php');
  exit;
}
?>
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Self-Processing Form</title>
  <style>
    body { font-family: system-ui, Arial; max-width: 720px; margin: 40px auto; padding: 0 16px; }
    .card { border:1px solid #ddd; border-radius: 12px; padding: 16px; }
    label { display:block; margin: 12px 0 6px; font-weight: 600; }
    input, textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 10px; }
    button { margin-top: 14px; padding: 10px 16px; border: 0; border-radius: 10px; cursor: pointer; }
    .msg { margin: 14px 0; padding: 12px; border-radius: 10px; }
    .err { background:#fff3f3; border:1px solid #ffcccc; }
    .ok  { background:#f0fff4; border:1px solid #b7f5c5; }
  </style>
</head>
<body>
  <h1>Self-Processing Form</h1>

  <?php if ($flash !== ''): ?>
    <div class="msg ok"><?= e($flash) ?></div>
  <?php endif; ?>

  <?php if (!empty($errors)): ?>
    <div class="msg err">
      <strong>Vui lòng sửa:</strong>
      <ul>
        <?php foreach ($errors as $er): ?>
          <li><?= e((string)$er) ?></li>
        <?php endforeach; ?>
      </ul>
    </div>
  <?php endif; ?>

  <div class="card">
    <form method="post" action="contact_self.php" novalidate>
      <label for="name">Họ tên *</label>
      <input id="name" name="name" type="text" value="<?= e((string)($old['name'] ?? '')) ?>" />

      <label for="email">Email *</label>
      <input id="email" name="email" type="email" value="<?= e((string)($old['email'] ?? '')) ?>" />

      <label for="message">Nội dung *</label>
      <textarea id="message" name="message" rows="6"><?= e((string)($old['message'] ?? '')) ?></textarea>

      <button type="submit">Gửi</button>
    </form>
  </div>
</body>
</html>

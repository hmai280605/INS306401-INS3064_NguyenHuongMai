<?php
declare(strict_types=1);

function e(string $s): string {
  return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

function old(string $key): string {
  return isset($_POST[$key]) ? trim((string)$_POST[$key]) : '';
}

function back_with_errors(array $errors): void {
  $name    = old('name');
  $email   = old('email');
  $subject = old('subject');
  $message = old('message');

  http_response_code(422);
  ?>
  <!doctype html>
  <html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lỗi gửi form</title>
    <style>
      body { font-family: system-ui, Arial; max-width: 720px; margin: 40px auto; padding: 0 16px; }
      .box { border:1px solid #ddd; border-radius: 12px; padding: 16px; }
      .errors { background:#fff3f3; border:1px solid #ffcccc; padding: 12px; border-radius: 10px; }
      .errors ul { margin: 8px 0 0 20px; }
      label { display:block; margin: 12px 0 6px; font-weight: 600; }
      input, textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; }
      button { margin-top: 14px; padding: 10px 16px; border: 0; border-radius: 10px; cursor: pointer; }
      a { display:inline-block; margin-top: 12px; }
    </style>
  </head>
  <body>
    <h1>Form có lỗi</h1>

    <div class="errors">
      <strong>Vui lòng sửa các lỗi sau:</strong>
      <ul>
        <?php foreach ($errors as $err): ?>
          <li><?= e($err) ?></li>
        <?php endforeach; ?>
      </ul>
    </div>

    <div class="box" style="margin-top:16px;">
      <form action="submit.php" method="post" novalidate>
        <label for="name">Họ tên *</label>
        <input id="name" name="name" type="text" value="<?= e($name) ?>" />

        <label for="email">Email *</label>
        <input id="email" name="email" type="email" value="<?= e($email) ?>" />

        <label for="subject">Tiêu đề</label>
        <input id="subject" name="subject" type="text" value="<?= e($subject) ?>" />

        <label for="message">Nội dung *</label>
        <textarea id="message" name="message" rows="6"><?= e($message) ?></textarea>

        <button type="submit">Gửi lại</button>
      </form>

      <a href="contact.html">← Quay về form gốc</a>
    </div>
  </body>
  </html>
  <?php
  exit;
}

// Chỉ xử lý POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Location: contact.html');
  exit;
}

// Lấy dữ liệu (gracefully: thiếu key thì thành chuỗi rỗng)
$name    = trim((string)($_POST['name'] ?? ''));
$email   = trim((string)($_POST['email'] ?? ''));
$subject = trim((string)($_POST['subject'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

// Validate cơ bản
$errors = [];

if ($name === '') {
  $errors[] = 'Họ tên không được để trống.';
} elseif (mb_strlen($name) < 2) {
  $errors[] = 'Họ tên phải từ 2 ký tự trở lên.';
}

if ($email === '') {
  $errors[] = 'Email không được để trống.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  $errors[] = 'Email không hợp lệ.';
}

if ($message === '') {
  $errors[] = 'Nội dung không được để trống.';
} elseif (mb_strlen($message) < 10) {
  $errors[] = 'Nội dung nên từ 10 ký tự trở lên.';
}

if ($subject !== '' && mb_strlen($subject) > 120) {
  $errors[] = 'Tiêu đề tối đa 120 ký tự.';
}

if ($errors) {
  back_with_errors($errors);
}

// Process (demo): hiển thị kết quả đã nhận
?>
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Gửi thành công</title>
  <style>
    body { font-family: system-ui, Arial; max-width: 720px; margin: 40px auto; padding: 0 16px; }
    .card { border: 1px solid #ddd; border-radius: 12px; padding: 16px; }
    .ok { background:#f0fff4; border:1px solid #b7f5c5; padding: 12px; border-radius: 10px; margin-bottom: 14px; }
    dt { font-weight: 700; margin-top: 10px; }
    dd { margin-left: 0; }
    a { display:inline-block; margin-top: 14px; }
  </style>
</head>
<body>
  <h1>Gửi thành công ✅</h1>
  <div class="ok">Dữ liệu đã được nhận và xử lý (demo).</div>

  <div class="card">
    <dl>
      <dt>Họ tên</dt><dd><?= e($name) ?></dd>
      <dt>Email</dt><dd><?= e($email) ?></dd>
      <dt>Tiêu đề</dt><dd><?= e($subject !== '' ? $subject : '(Không có)') ?></dd>
      <dt>Nội dung</dt><dd><?= nl2br(e($message)) ?></dd>
    </dl>
  </div>

  <a href="contact.html">← Gửi form mới</a>
</body>
</html>

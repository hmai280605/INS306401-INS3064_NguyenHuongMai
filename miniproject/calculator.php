<?php
declare(strict_types=1);

function e(string $s): string {
  return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

$aRaw = $_POST['a'] ?? '';
$bRaw = $_POST['b'] ?? '';
$op   = $_POST['op'] ?? '+';

$result = null;
$error  = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $aStr = trim((string)$aRaw);
  $bStr = trim((string)$bRaw);

  if ($aStr === '' || $bStr === '') {
    $error = 'Vui lòng nhập đủ 2 số.';
  } elseif (!is_numeric($aStr) || !is_numeric($bStr)) {
    $error = 'Giá trị nhập phải là số (numeric).';
  } else {
    // Type casting an toàn
    $a = (float)$aStr;
    $b = (float)$bStr;

    // Validate phép toán
    $allowed = ['+', '-', '*', '/'];
    if (!in_array($op, $allowed, true)) {
      $error = 'Phép toán không hợp lệ.';
    } elseif ($op === '/' && $b == 0.0) {
      $error = 'Không thể chia cho 0.';
    } else {
      // match (PHP 8+)
      $result = match ($op) {
        '+' => $a + $b,
        '-' => $a - $b,
        '*' => $a * $b,
        '/' => $a / $b,
      };
    }
  }
}
?>
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Arithmetic Calculator</title>
  <style>
    body { font-family: system-ui, Arial; max-width: 720px; margin: 40px auto; padding: 0 16px; }
    .row { display: grid; grid-template-columns: 1fr 140px 1fr; gap: 12px; }
    input, select { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 10px; }
    button { margin-top: 14px; padding: 10px 16px; border: 0; border-radius: 10px; cursor: pointer; }
    .msg { margin-top: 14px; padding: 12px; border-radius: 10px; }
    .err { background:#fff3f3; border:1px solid #ffcccc; }
    .ok  { background:#f0fff4; border:1px solid #b7f5c5; }
  </style>
</head>
<body>
  <h1>Arithmetic Calculator</h1>

  <form method="post" action="calculator.php" novalidate>
    <div class="row">
      <input type="text" name="a" placeholder="Số A" value="<?= e((string)$aRaw) ?>" />
      <select name="op">
        <option value="+" <?= $op==='+'?'selected':'' ?>>+</option>
        <option value="-" <?= $op==='-'?'selected':'' ?>>-</option>
        <option value="*" <?= $op==='*'?'selected':'' ?>>×</option>
        <option value="/" <?= $op==='/'?'selected':'' ?>>÷</option>
      </select>
      <input type="text" name="b" placeholder="Số B" value="<?= e((string)$bRaw) ?>" />
    </div>

    <button type="submit">Tính</button>
  </form>

  <?php if ($error !== ''): ?>
    <div class="msg err"><strong>Lỗi:</strong> <?= e($error) ?></div>
  <?php elseif ($result !== null): ?>
    <div class="msg ok">
      <strong>Kết quả:</strong>
      <?= e((string)$aRaw) ?> <?= e($op) ?> <?= e((string)$bRaw) ?> = <?= e((string)$result) ?>
    </div>
  <?php endif; ?>
</body>
</html>

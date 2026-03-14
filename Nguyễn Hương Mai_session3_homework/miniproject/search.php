<?php
declare(strict_types=1);

function e(string $s): string {
  return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

$q = trim((string)($_GET['q'] ?? ''));
?>
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Search Query Echo</title>
  <style>
    body { font-family: system-ui, Arial; max-width: 720px; margin: 40px auto; padding: 0 16px; }
    form { display:flex; gap: 10px; }
    input { flex:1; padding: 10px; border: 1px solid #ccc; border-radius: 10px; }
    button { padding: 10px 16px; border: 0; border-radius: 10px; cursor: pointer; }
    .card { margin-top: 16px; border:1px solid #ddd; border-radius: 12px; padding: 16px; }
    code { background:#f5f5f5; padding: 2px 6px; border-radius: 6px; }
    .muted { color:#666; }
  </style>
</head>
<body>
  <h1>Search Query Echo</h1>

  <form method="get" action="search.php">
    <input type="text" name="q" placeholder="Nhập từ khóa..." value="<?= e($q) ?>" />
    <button type="submit">Search</button>
  </form>

  <div class="card">
    <?php if ($q === ''): ?>
      <div class="muted">Chưa có từ khóa. Hãy nhập và bấm Search.</div>
    <?php else: ?>
      <div><strong>Bạn vừa tìm:</strong> <code><?= e($q) ?></code></div>
      <div class="muted" style="margin-top:8px;">
        Query param trên URL: <code>?q=<?= e($q) ?></code>
      </div>
    <?php endif; ?>
  </div>
</body>
</html>

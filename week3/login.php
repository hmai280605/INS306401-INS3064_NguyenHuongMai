<?php
session_start();

// Tài khoản mẫu (bài tập)
$correctUser = "admin";
$correctPass = "123456";

// Số lần sai tối đa
$maxAttempts = 3;

// Khởi tạo bộ đếm nếu chưa có
if (!isset($_SESSION["attempts"])) {
  $_SESSION["attempts"] = 0;
}

// Nếu bấm nút reset
if (isset($_POST["reset"])) {
  $_SESSION["attempts"] = 0;
  unset($_SESSION["logged_in"]);
}

// Nếu đã đăng nhập
if (isset($_SESSION["logged_in"]) && $_SESSION["logged_in"] === true) {
  echo "<h2>✅ Login success!</h2>";
  echo "<p>Welcome, <b>$correctUser</b> 👋</p>";
  echo "<form method='post'><button name='reset'>Logout</button></form>";
  exit;
}

$message = "";

// Nếu bị khóa
if ($_SESSION["attempts"] >= $maxAttempts) {
  $message = "❌ Too many failed attempts. You are locked out.";
} else {
  // Xử lý form khi submit
  if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["login"])) {
    $username = trim($_POST["username"] ?? "");
    $password = trim($_POST["password"] ?? "");

    // Kiểm tra trống
    if ($username === "" || $password === "") {
      $message = "⚠️ Please fill in all fields.";
    } else {
      // Check đúng/sai
      if ($username === $correctUser && $password === $correctPass) {
        $_SESSION["logged_in"] = true;
        $message = "✅ Login success!";
      } else {
        $_SESSION["attempts"]++;
        $left = $maxAttempts - $_SESSION["attempts"];
        $message = "❌ Wrong username or password. Attempts left: $left";
      }
    }
  }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login with Counter</title>
  <style>
    body { font-family: Arial; background:#f4f6f8; }
    .box{
      width: 380px; margin: 70px auto; background:#fff;
      padding: 20px; border-radius: 10px;
    }
    input, button { width:100%; padding:10px; margin-top:10px; }
    button { background:#007bff; color:white; border:none; cursor:pointer; }
    .msg { margin-top: 12px; font-weight: bold; }
    .danger { color: red; }
    .ok { color: green; }
  </style>
</head>
<body>

<div class="box">
  <h2>Login</h2>

  <form method="post">
    <input type="text" name="username" placeholder="Username (admin)">
    <input type="password" name="password" placeholder="Password (123456)">

    <button type="submit" name="login" <?php echo ($_SESSION["attempts"] >= $maxAttempts) ? "disabled" : ""; ?>>
      Login
    </button>

    <button type="submit" name="reset" style="background:#6c757d;">Reset Counter</button>
  </form>

  <div class="msg <?php echo (str_contains($message, "✅")) ? "ok" : "danger"; ?>">
    <?php echo $message; ?>
  </div>

  <p>Failed attempts: <b><?php echo $_SESSION["attempts"]; ?></b> / <?php echo $maxAttempts; ?></p>
</div>

</body>
</html>

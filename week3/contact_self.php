<?php
session_start();

/* --- Helper: chống XSS khi in ra HTML --- */
function e($value) {
  return htmlspecialchars($value ?? "", ENT_QUOTES, "UTF-8");
}

/* --- Giá trị mặc định --- */
$errors = [];
$old = ["name" => "", "email" => "", "message" => ""];

/* --- Nếu có dữ liệu flash từ lần submit trước --- */
if (isset($_SESSION["old"])) {
  $old = $_SESSION["old"];
  unset($_SESSION["old"]);
}
if (isset($_SESSION["errors"])) {
  $errors = $_SESSION["errors"];
  unset($_SESSION["errors"]);
}
$success = $_SESSION["success"] ?? "";
unset($_SESSION["success"]);

/* --- Xử lý POST --- */
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $name = trim($_POST["name"] ?? "");
  $email = trim($_POST["email"] ?? "");
  $message = trim($_POST["message"] ?? "");

  // Lưu lại dữ liệu để hiện lại khi lỗi
  $_SESSION["old"] = ["name" => $name, "email" => $email, "message" => $message];

  // Validate
  if ($name === "") $errors["name"] = "Name is required.";
  if ($email === "") $errors["email"] = "Email is required.";
  elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors["email"] = "Invalid email format.";
  if ($message === "") $errors["message"] = "Message is required.";
  elseif (strlen($message) < 10) $errors["message"] = "Message must be at least 10 characters.";

  // Nếu lỗi -> PRG redirect về GET để hiện lỗi
  if (!empty($errors)) {
    $_SESSION["errors"] = $errors;
    header("Location: " . $_SERVER["PHP_SELF"]);
    exit;
  }

  // Thành công -> set success + clear old + PRG redirect
  unset($_SESSION["old"]);
  $_SESSION["success"] = "✅ Thanks, $name! Your message has been sent successfully.";
  header("Location: " . $_SERVER["PHP_SELF"] . "?sent=1");
  exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Self-Processing Contact Form</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f4f6f8; }
    .box { width: 420px; margin: 60px auto

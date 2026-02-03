<?php
require_once "utils.php";

function showResult($label, $result) {
  echo $label . " => " . ($result ? "PASS ✅" : "FAIL ❌") . "<br>";
}

echo "<h2>Test Validation Utilities</h2>";

echo "<h3>1) sanitize()</h3>";
$raw = "  <script>alert('xss')</script>  ";
echo "Raw: " . $raw . "<br>";
echo "Sanitized: " . sanitize($raw) . "<br>";

echo "<h3>2) validateEmail()</h3>";
showResult("valid: test@gmail.com", validateEmail("test@gmail.com"));
showResult("invalid: abc@", validateEmail("abc@"));
showResult("invalid: empty", validateEmail(""));

echo "<h3>3) validateLength()</h3>";
showResult("Len 3-10: 'Hello'", validateLength("Hello", 3, 10));
showResult("Len 6-10: 'Hello'", validateLength("Hello", 6, 10));
showResult("Len 1-4: 'Hương Mai'", validateLength("Hương Mai", 1, 4));

echo "<h3>4) validatePassword()</h3>";
showResult("pass: Abc@1234", validatePassword("Abc@1234"));   // đủ 8 + có @
showResult("fail: 12345678", validatePassword("12345678"));   // không có ký tự đặc biệt
showResult("fail: Abc@12", validatePassword("Abc@12"));       // quá ngắn

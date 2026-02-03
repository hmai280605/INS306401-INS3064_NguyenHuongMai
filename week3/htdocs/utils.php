<?php
// utils.php

function sanitize($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data, ENT_QUOTES, "UTF-8");
  return $data;
}

function validateEmail($email) {
  $email = trim($email);
  return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validateLength($str, $min, $max) {
  $len = mb_strlen($str, "UTF-8");
  return ($len >= $min && $len <= $max);
}

// Password: ít nhất 8 ký tự và có ít nhất 1 ký tự đặc biệt
function validatePassword($pass) {
  $pass = (string)$pass;

  $minLen = 8;
  $hasSpecial = preg_match('/[^a-zA-Z0-9]/', $pass); // ký tự đặc biệt

  return (strlen($pass) >= $minLen) && ($hasSpecial === 1);
}

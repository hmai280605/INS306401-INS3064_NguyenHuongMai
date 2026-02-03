<?php
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';

if (empty($name) || empty($email) || empty($message)) {
    echo "<h3 style='color:red'>❌ Please fill in all fields.</h3>";
    echo "<a href='contact.html'>Go back</a>";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "<h3 style='color:red'>❌ Invalid email format.</h3>";
    echo "<a href='contact.html'>Go back</a>";
    exit;
}

echo "<h2>✅ Message Received</h2>";
echo "<p><strong>Name:</strong> $name</p>";
echo "<p><strong>Email:</strong> $email</p>";
echo "<p><strong>Message:</strong> $message</p>";
?>

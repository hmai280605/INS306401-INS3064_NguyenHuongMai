<?php
session_start();
include "db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $role = $_POST['role'];

    $sql = "SELECT * FROM staff WHERE name = ? AND role = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $name, $role);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $staff = $result->fetch_assoc();

        $_SESSION['staff_id'] = $staff['staff_id'];
        $_SESSION['name'] = $staff['name'];
        $_SESSION['role'] = $staff['role'];

        header("Location: dashboard.php");
        exit();
    } else {
        $error = "Invalid login information";
    }
}
?>

<form method="POST">
    <h2>Login</h2>

    <input type="text" name="name" placeholder="Staff name" required>

    <select name="role" required>
        <option value="warehouse_staff">Warehouse Staff</option>
        <option value="manager">Manager</option>
        <option value="seller_staff">Seller Staff</option>
    </select>

    <button type="submit">Login</button>

    <?php if (isset($error)) echo "<p>$error</p>"; ?>
</form>
<?php
session_start(); // Start session to manage user login state

$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'user_management';

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Process login form data
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);

    // Check if the email exists
    $sql = "SELECT * FROM users WHERE email='$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Verify the password
        if (password_verify($password, $user['password'])) {
            // Set session variables on successful login
            $_SESSION['username'] = $user['username'];
            $_SESSION['loggedin'] = true;

            // Redirect to the 2048 game page
            header("Location: 2048.html");
            exit(); // Ensure the script stops after redirect
        } else {
            echo "Invalid password!";
        }
    } else {
        echo "Email not registered!";
    }
}
$conn->close();
?>

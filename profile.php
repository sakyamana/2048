<?php
// Database connection credentials
$servername = "localhost";  // Use your server name
$username = "root";         // Use your database username
$password = "";             // Use your database password
$dbname = "2048_game";      // Database name

// Create connection to MySQL database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch player data
$sql = "SELECT username, email, score, time_taken FROM player_data";  // Assuming table name is `player_data`
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Player Profiles</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }
        .profile-card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 250px;
            padding: 20px;
            text-align: center;
            transition: transform 0.3s;
        }
        .profile-card:hover {
            transform: scale(1.05);
        }
        .profile-card h2 {
            font-size: 24px;
            margin: 0;
            color: #333;
        }
        .profile-card p {
            color: #555;
            font-size: 14px;
            margin: 10px 0;
        }
        .profile-card .score {
            font-size: 18px;
            color: #009688;
            font-weight: bold;
        }
    </style>
</head>
<body>

    <h1 style="text-align:center;">Player Profiles</h1>
    <div class="container">
        <?php
        // Check if there are results
        if ($result->num_rows > 0) {
            // Loop through each row and display player profile
            while($row = $result->fetch_assoc()) {
                echo '<div class="profile-card">';
                echo '<h2>' . $row["username"] . '</h2>';
                echo '<p>Email: ' . $row["email"] . '</p>';
                echo '<p class="score">High Score: ' . $row["score"] . '</p>';
                echo '<p>Time Taken: ' . $row["time_taken"] . ' seconds</p>';
                echo '</div>';
            }
        } else {
            echo "<p>No player data found.</p>";
        }
        // Close connection
        $conn->close();
        ?>
    </div>

</body>
</html>

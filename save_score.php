<?php
$host = 'localhost';
$user = 'root'; // Default user for XAMPP
$pass = ''; // Default password is empty in XAMPP
$db = '2048_game';

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get POST data from the request
$data = json_decode(file_get_contents('php://input'), true);
$player_name = $data['player_name'];
$score = $data['score'];
$time_taken = $data['time_taken'];

// Insert game data into the database
$sql = "INSERT INTO game_scores (player_name, score, time_taken) VALUES ('$player_name', '$score', '$time_taken')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Score saved successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
}

// Close the connection
$conn->close();
?>

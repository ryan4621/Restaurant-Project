<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "restaurant_db"; // replace this with your actual database name

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

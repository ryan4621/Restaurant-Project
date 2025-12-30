<?php
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['reservation_id'], $_POST['status'])) {
    $id = intval($_POST['reservation_id']);
    $status = $_POST['status'];

    include 'db_connect.php';

    $stmt = $conn->prepare("UPDATE reservations SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $id);
    $stmt->execute();
    $stmt->close();
    $conn->close();
}

header("Location: view_reservations.php");
exit;
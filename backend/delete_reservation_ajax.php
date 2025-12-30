<?php
session_start();
include 'db_connect.php';

if (!isset($_SESSION['admin_logged_in'])) {
    http_response_code(403);
    echo 'Unauthorized';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $id = intval($_POST['id']);
    if ($conn->query("DELETE FROM reservations WHERE id = $id") === TRUE) {
        echo 'success';
    } else {
        echo 'Failed to delete record.';
    }
} else {
    echo 'Invalid request.';
}
?>

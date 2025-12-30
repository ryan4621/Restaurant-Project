<?php
include 'db_connect.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $conn->query("DELETE FROM reservations WHERE id = $id");
}
header("Location: view_reservations.php");
exit;
?>
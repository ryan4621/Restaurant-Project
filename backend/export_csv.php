<?php
include 'db_connect.php';
header('Content-Type: text/csv');
header('Content-Disposition: attachment;filename=reservations.csv');

$output = fopen("php://output", "w");
fputcsv($output, ['ID', 'Name', 'Email', 'Date']);

$result = $conn->query("SELECT * FROM reservations");
while ($row = $result->fetch_assoc()) {
    fputcsv($output, $row);
}
fclose($output);
exit;
?>

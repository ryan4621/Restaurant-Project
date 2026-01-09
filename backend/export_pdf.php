<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require('fpdf186/fpdf.php');
include 'db_connect.php';

$pdf = new FPDF('L');
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 10);

$pdf->Cell(10, 10, 'ID', 1);
$pdf->Cell(30, 10, 'Name', 1);
$pdf->Cell(60, 10, 'Email', 1);
$pdf->Cell(40, 10, 'Date', 1);
$pdf->Cell(25, 10, 'Phone', 1);
$pdf->Cell(50, 10, 'Title', 1);
$pdf->Cell(20, 10, 'Price', 1);
$pdf->Cell(20, 10, 'Status', 1);
$pdf->Ln();

$result = $conn->query("SELECT id, name, email, reservation_date, phone, reservation_title, reservation_price, status FROM reservations");

if ($result) {
    $pdf->SetFont('Arial', '', 10);
    while ($row = $result->fetch_assoc()) {
        $pdf->Cell(10, 10, $row['id'], 1);
        $pdf->Cell(30, 10, $row['name'], 1);
        $pdf->Cell(60, 10, $row['email'], 1);
        $pdf->Cell(40, 10, $row['reservation_date'], 1);
        $pdf->Cell(25, 10, $row['phone'], 1);
        $pdf->Cell(50, 10, $row['reservation_title'], 1);
        $pdf->Cell(20, 10, $row['reservation_price'], 1);
        $pdf->Cell(20, 10, $row['status'], 1);
        $pdf->Ln();
    }
} else {
    die('Error querying database: ' . $conn->error);
}

$pdf->Output('D', 'view_reservations.pdf');
exit;
?>
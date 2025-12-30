<?php
$token = $_GET['token'] ?? '';

if (!$token) {
    exit("Invalid request.");
}

include 'db_connect.php';

$stmt = $conn->prepare("SELECT * FROM reservations WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    exit("Reservation not found or already deleted.");
}

$reservation = $result->fetch_assoc();

// Handle cancellation request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cancel'])) {
    // Cancel the reservation (delete from database)
    $deleteStmt = $conn->prepare("DELETE FROM reservations WHERE token = ?");
    $deleteStmt->bind_param("s", $token);
    $deleteStmt->execute();
    $deleteStmt->close();

    echo "Your reservation has been cancelled.";
    exit; // Stop further processing
}
?>

<h2>Reservation Details</h2>
<ul>
    <li><strong>Name:</strong> <?php echo htmlspecialchars($reservation['name']); ?></li>
    <li><strong>Email:</strong> <?php echo htmlspecialchars($reservation['email']); ?></li>
    <li><strong>Phone:</strong> <?php echo htmlspecialchars($reservation['phone']); ?></li>
    <li><strong>Title:</strong> <?php echo htmlspecialchars($reservation['reservation_title']); ?></li>
    <li><strong>Date:</strong> <?php echo htmlspecialchars($reservation['reservation_date']); ?></li>
    <li><strong>Price:</strong> $<?php echo htmlspecialchars($reservation['reservation_price']); ?></li>
</ul>

<!-- Cancel button -->
<form method="POST" onsubmit="return confirm('Are you sure you want to cancel this reservation?');">
    <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">
    <button type="submit" name="cancel" style="padding:10px 15px; background-color:#d9534f; color:white; border:none; border-radius:5px; cursor:pointer;">
        Cancel Reservation
    </button>
</form>

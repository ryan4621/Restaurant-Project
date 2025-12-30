<?php
    session_start();
    if (!isset($_SESSION['admin_logged_in'])) {
        header("Location: admin_login.php");
        exit;
    }

    include 'db_connect.php';

    $search = $_GET['search'] ?? '';
    $query = "SELECT id, name, email, phone, reservation_title, reservation_date, reservation_price, status FROM reservations";
    if ($search) {
        $safeSearch = $conn->real_escape_string($search);
        $query .= " WHERE name LIKE '%$safeSearch%' OR phone LIKE '%$safeSearch%'";
    }
    $result = $conn->query($query);
?>

<!DOCTYPE html>
<html>
<head>
    <title>View Reservations</title>
    <style>
        table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 8px;
        }
        #confirmModal {
            display: none; 
            position: fixed; 
            z-index: 1000; 
            padding-top: 100px; 
            left: 0; top: 0; width: 100%; height: 100%; 
            overflow: auto; background-color: rgba(0,0,0,0.4);
        }
        #confirmModalContent {
            background-color: #fefefe;
            margin: auto; padding: 20px;
            border: 1px solid #888; width: 80%;
            max-width: 400px;
            text-align: center;
        }
        #modalMessage {
            margin: 15px 0;
        }
        #modalButtons button {
            margin: 5px;
        }
    </style>
</head>
<body>

<h2>Reservations</h2>

<form method="GET">
    <input type="text" name="search" placeholder="Search name or phone" value="<?php echo htmlspecialchars($search); ?>">
    <input type="submit" value="Search">
    <a href="export_pdf.php" style="margin-left: 20px;">Export to PDF</a>
</form>

<table>
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Title</th>
        <th>Date</th>
        <th>Price</th>
        <th>Status</th>
        <th>Actions</th>
    </tr>
    <?php if ($result->num_rows > 0): ?>
        <?php while ($row = $result->fetch_assoc()): ?>
            <tr id="row-<?php echo $row['id']; ?>">
                <td><?php echo $row['id']; ?></td>
                <td><?php echo htmlspecialchars($row['name']); ?></td>
                <td><?php echo htmlspecialchars($row['email']); ?></td>
                <td><?php echo htmlspecialchars($row['phone']); ?></td>
                <td><?= htmlspecialchars($row['reservation_title']) ?></td>
                <td><?= htmlspecialchars($row['reservation_date']) ?></td>
                <td><?= number_format($row['reservation_price'], 2) ?></td>
                <td>
                    <form method="POST" action="update_status.php">
                        <input type="hidden" name="reservation_id" value="<?= $row['id'] ?>">
                        <select name="status" onchange="this.form.submit()">
                            <option value="Pending" <?= $row['status'] === 'Pending' ? 'selected' : '' ?>>Pending</option>
                            <option value="Confirmed" <?= $row['status'] === 'Confirmed' ? 'selected' : '' ?>>Confirmed</option>
                            <option value="Cancelled" <?= $row['status'] === 'Cancelled' ? 'selected' : '' ?>>Cancelled</option>
                        </select>
                    </form>
                </td>

                <td>
                    <button class="delete-btn" data-id="<?php echo $row['id']; ?>">Delete</button>
                </td>
            </tr>
        <?php endwhile; ?>
    <?php else: ?>
        <tr><td colspan="5">No reservations found.</td></tr>
    <?php endif; ?>
</table>

<div id="confirmModal">
    <div id="confirmModalContent">
        <p id="modalMessage">Are you sure you want to delete this reservation?</p>
        <div id="modalButtons">
            <button id="confirmDelete">Yes, Delete</button>
            <button id="cancelDelete">Cancel</button>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
let selectedId = null;

$(document).ready(function() {
    $('.delete-btn').click(function() {
        selectedId = $(this).data('id');
        $('#modalMessage').text('Are you sure you want to delete this reservation?');
        $('#confirmDelete').show();
        $('#modalButtons').show();
        $('#confirmModal').show();
    });

    $('#cancelDelete').click(function() {
        selectedId = null;
        $('#confirmModal').hide();
    });

    $('#confirmDelete').click(function() {
        if (!selectedId) return;

        $.ajax({
            url: 'delete_reservation_ajax.php',
            type: 'POST',
            data: { id: selectedId },
            success: function(response) {
                if (response === 'success') {
                    if ($('#row-' + selectedId).length) {
                        $('#row-' + selectedId).remove();
                    }
                    $('#modalMessage').text('Reservation deleted successfully.');
                    $('#confirmDelete').hide();
                    $('#modalButtons').hide();
                } else {
                    $('#modalMessage').text('Delete failed: ' + response);
                }
                setTimeout(() => {
                    $('#confirmModal').hide();
                    selectedId = null;
                }, 2000);
            },

            error: function() {
                $('#modalMessage').text('Server error. Please try again.');
                setTimeout(() => {
                    $('#confirmModal').hide();
                    selectedId = null;
                }, 2000);
            }
        });
    });
});
</script>

</body>
</html>
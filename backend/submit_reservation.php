<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '/Applications/XAMPP/xamppfiles/htdocs/vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['names'], $_POST['email'], $_POST['phone'], $_POST['reservation_title'], $_POST['reservation_date'], $_POST['reservation_price'])) {
    $name = htmlspecialchars(trim($_POST['names']));
    $email = htmlspecialchars(trim($_POST['email']));
    $phone = htmlspecialchars(trim($_POST['phone']));
    $reservation_title = htmlspecialchars(trim($_POST['reservation_title'] ?? ''));
    $reservation_date_raw = htmlspecialchars(trim($_POST['reservation_date'] ?? ''));
    $reservation_date_raw = preg_replace('/\s+/', ' ', $reservation_date_raw);
    $raw_price = $_POST['reservation_price'] ?? '';
    $clean_price = trim(str_replace(['$', ','], '', $raw_price));
    $reservation_price = floatval($clean_price);

    $reservation_date = '';
    $date_obj = false;
    
    $formats = [
        'Y-m-d H:i:s',
        'Y-m-d H:i',
        'F j, Y \a\t H:i',
        'F j, Y H:i',
        'd/m/Y H:i',
        'm/d/Y H:i',
    ];
    
    foreach ($formats as $format) {
        $date_obj = DateTime::createFromFormat($format, $reservation_date_raw);
        if ($date_obj !== false) {
            $reservation_date = $date_obj->format('Y-m-d H:i:s');
            break;
        }
    }
    
    if ($date_obj === false) {
        exit("Invalid date format received: '$reservation_date_raw'. Please contact support.");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        exit("Invalid email format.");
    }

    if (!preg_match("/^\+?[0-9]{10,15}$/", $phone)) {
        exit("Invalid phone number. Use 10 to 15 digits only.");
    }

    if (empty($reservation_title) || empty($reservation_date) || empty($reservation_price)) {
        exit("All fields are required.");
    }

    $token = bin2hex(random_bytes(16));

    include 'db_connect.php';
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $checkStmt = $conn->prepare("SELECT id FROM reservations WHERE reservation_date = ?");
    $checkStmt->bind_param("s", $reservation_date);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows > 0) {
        echo "This time slot is already booked.";
        exit;
    }
    $checkStmt->close();

    $status = 'Pending';
    $stmt = $conn->prepare("INSERT INTO reservations (name, email, phone, reservation_title, reservation_date, reservation_price, status, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssdss", $name, $email, $phone, $reservation_title, $reservation_date, $reservation_price, $status, $token);
    
    if (!$stmt->execute()) {
        error_log("Database error: " . $stmt->error);
        exit("Database error occurred. Please try again.");
    }
    
    $stmt->close();
    $conn->close();

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'lucaslucass47151@gmail.com';
        $mail->Password = 'gqhtflhyrpjlylxd';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        $mail->setFrom('lucaslucass47151@gmail.com', 'BOHO Restaurant');
        $mail->addAddress($email, $name);

        $mail->isHTML(true);
        $mail->Subject = 'Reservation Confirmation';
        $link = "http://localhost/niit-project/backend/manage_reservation.php?token=$token";
        
        $display_date = date('l, F j, Y \a\t g:i A', strtotime($reservation_date));
        
        $mail->Body = "
            <h2>Reservation Confirmation</h2>
            <p>Hi <strong>$name</strong>,</p>
            <p>Thank you for your reservation. Here are your reservation details:</p>
            <ul>
                <li><strong>Reservation:</strong> $reservation_title</li>
                <li><strong>Date & Time:</strong> $display_date</li>
                <li><strong>Price:</strong> $" . number_format($reservation_price, 2) . "</li>
                <li><strong>Phone:</strong> $phone</li>
                <li><strong>Email:</strong> $email</li>
            </ul>
            <p style='margin-top:20px;'>
                <a href='$link' style='display:inline-block;padding:10px 15px;background-color:#d9534f;color:#fff;text-decoration:none;border-radius:5px;'>
                    Cancel Reservation
                </a>
            </p>
            <p>We look forward to seeing you!</p>
            <p>Regards,<br>BOHO Restaurant Team</p>
        ";

        $mail->SMTPDebug = 0;
        
        $mail->send();

        $adminMail = new PHPMailer(true);
        try {
            $adminMail->isSMTP();
            $adminMail->Host = 'smtp.gmail.com';
            $adminMail->SMTPAuth = true;
            $adminMail->Username = 'lucaslucass47151@gmail.com';
            $adminMail->Password = 'gqhtflhyrpjlylxd';
            $adminMail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $adminMail->Port = 465;

            $adminMail->setFrom('lucaslucass47151@gmail.com', 'BOHO Reservation System');
            $adminMail->addAddress('frenchman27595@gmail.com', 'Admin');

            $adminMail->isHTML(true);
            $adminMail->Subject = 'New Reservation Received';
            $adminMail->Body = "
                <h3>New Reservation Details:</h3>
                <p><strong>Name:</strong> $name</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Phone:</strong> $phone</p>
                <p><strong>Reservation:</strong> $reservation_title</p>
                <p><strong>Date & Time:</strong> $display_date</p>
                <p><strong>Price:</strong> $" . number_format($reservation_price, 2) . "</p>
            ";

            $adminMail->SMTPDebug = 0;
            $adminMail->send();
        } catch (Exception $e) {
            error_log("Admin email failed: {$adminMail->ErrorInfo}");
        }

        echo 'Success!';
    } catch (Exception $e) {
        error_log("Email error: {$mail->ErrorInfo}");
        echo "Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }

    exit;
} else {
    echo "Please submit the form properly.";
}
?>
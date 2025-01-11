<?php

define('SUBMISSIONS_FILE', 'submissions.json');


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $firstname = filter_var(trim($_POST['firstname']), FILTER_SANITIZE_STRING);
    $lastname = filter_var(trim($_POST['lastname']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
    $telephone = filter_var(trim($_POST['telephone']), FILTER_SANITIZE_STRING);
    $message = filter_var(trim($_POST['message']), FILTER_SANITIZE_STRING);
    $terms = isset($_POST['terms']) ? true : false;

    if (!$firstname || !$lastname || !$email || !$message || !$terms) {
        echo "All fields marked with * are required.";
        exit;
    }

    // Save the form data to a JSON file
    $submissionData = [
        'firstname' => $firstname,
        'lastname' => $lastname,
        'email' => $email,
        'telephone' => $telephone,
        'message' => $message,
        'timestamp' => time()
    ];

    if (!file_exists(SUBMISSIONS_FILE)) {
        file_put_contents(SUBMISSIONS_FILE, json_encode([], JSON_PRETTY_PRINT));
    }

    $submissions = json_decode(file_get_contents(SUBMISSIONS_FILE), true);
    $submissions[] = $submissionData;

    if (!file_put_contents(SUBMISSIONS_FILE, json_encode($submissions, JSON_PRETTY_PRINT))) {
        echo "Error saving the submission data.";
        exit;
    }

    // Send the auto-response email to the user
    $subject = "Thank you for your submission!";
    $body = "Dear $firstname $lastname,\n\nThank you for reaching out! We have received your submission and will get back to you shortly.\n\nYour message:\n$message\n\nBest regards,\nThe Team";
    $headers = "From: no-reply@yourdomain.com\r\n";

    if (!mail($email, $subject, $body, $headers)) {
        echo "Error sending auto-response email.";
        exit;
    }

    // Send the admin email
    $adminEmails = ["dumidu.kodithuwakku@ebeyonds.com", "prabhath.senadheera@ebeyonds.com"];
    $adminSubject = "New form submission received";
    $adminBody = "A new submission has been received from $firstname $lastname.\n\nDetails:\nEmail: $email\nTelephone: $telephone\nMessage: $message\n\nTimestamp: " . date('Y-m-d H:i:s', $submissionData['timestamp']);
    $adminHeaders = "From: no-reply@yourdomain.com\r\n";

    foreach ($adminEmails as $adminEmail) {
        if (!mail($adminEmail, $adminSubject, $adminBody, $adminHeaders)) {
            echo "Error sending admin email.";
            exit;
        }
    }

    header("Location: thank-you.html");
    exit;
} else {
    echo "Invalid request method.";
    exit;
}
?>

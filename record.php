<?php
require_once('database.php');
require_once('load_env.php');
loadEnv(__DIR__ . '/.env');

$pdo = getPdo();
$received = file_get_contents("php://input");
$object = json_decode($received);
$tab = json_decode(json_encode($object), true);

$success = false;
$msg = "";

if (!empty($tab['name']) && !empty($tab['score'])) {
    $name = sanitizeInput($tab['name']);
    $score = sanitizeInput($tab['score']);

    if (strlen($name) > 10) {
        $msg = "Your warrior name cannot exceed 10 characters!";
    } else {
        if ($score > 141) {
            $msg = "Your battle score cannot exceed 141 points!";
        } else {
            try {
                $statement = $pdo->prepare('INSERT INTO game SET name = ?, score = ?');
                $statement->execute(array($name, $score));
                $success = true;

                $mailTo = getenv('MAIL_TO');
                $mailFrom = getenv('MAIL_FROM');
                $mailFromName = getenv('MAIL_FROM_NAME');

                $to = $mailTo;
                $subject = "New High Score Recorded - Kill Em'All Game";
                $message = "Warrior '$name' has achieved a new battle score of $score points in Kill Em'All!\n\n";
                $message .= "View the Hall of Fame at: " . (isset($_SERVER['HTTP_HOST']) ? "https://" . $_SERVER['HTTP_HOST'] : "your-domain.com");
                $headers = "From: $mailFromName <$mailFrom>\r\n";
                $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

                mail($to, $subject, $message, $headers);
            } catch (Exception $e) {
                error_log("Email notification error: " . $e->getMessage());
            }
        }
    }
} else {
    $msg = "Please enter your warrior name to claim your glory!";
}

$response = ["success" => $success, "msg" => $msg];
header('Content-Type: application/json');
echo json_encode($response);

function sanitizeInput($var)
{
    $var = trim($var);
    $var = stripslashes($var);
    $var = htmlspecialchars($var, ENT_QUOTES, 'UTF-8');
    return $var;
}

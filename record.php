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

if (!empty($tab['name']) and !empty($tab['score'])) {
    $name = verifyInput($tab['name']);
    $score = verifyInput($tab['score']);
    if (strlen($name) > 10) {
        $msg = "Votre nom ne peut dépasser 10 caractères !";
    } else {
        if ($score > 141) {
            $msg = "Votre score ne peut dépasser 141 points !";
        } else {
            $statement = $pdo->prepare('INSERT INTO game SET name = ?, score = ?');
            $statement->execute(array($name, $score));
            $success = true;
            try {
                $mailTo = getenv('MAIL_TO');
                $mailFrom = getenv('MAIL_FROM');
                $mailFromName = getenv('MAIL_FROM_NAME');

                $to = $mailTo;
                $subject = "Nouveau score enregistré";
                $message = "Le joueur '$name' a enregistré un nouveau score de $score points.";
                $headers = "From: $mailFromName <$mailFrom>";

                mail($to, $subject, $message, $headers);
            } catch (Exception $e) {
                error_log("Erreur envoi email: " . $e->getMessage());
            }
        }
    }
} else {
    $msg = "Veuillez remplir votre nom !";
}

$response = ["success" => $success, "msg" => $msg];

echo json_encode($response);

function verifyInput($var)
{
    $var = trim($var);
    $var = stripslashes($var);
    $var = htmlspecialchars($var);
    return $var;
}

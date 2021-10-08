<?php

require_once('database.php');
$pdo = getPdo();

?>

<!DOCTYPE html>
<html lang="fr">

<head>
  <script type="text/javascript" src="./tarteaucitron/tarteaucitron.js"></script>
  <script type="text/javascript">
    tarteaucitron.init({
      "privacyUrl": "",
      /* Privacy policy url */

      "hashtag": "#tarteaucitron",
      /* Open the panel with this hashtag */
      "cookieName": "tarteaucitron",
      /* Cookie name */

      "orientation": "middle",
      /* Banner position (top - bottom) */

      "groupServices": false,
      /* Group services by category */

      "showAlertSmall": false,
      /* Show the small banner on bottom right */
      "cookieslist": false,
      /* Show the cookie list */

      "closePopup": false,
      /* Show a close X on the banner */

      "showIcon": true,
      /* Show cookie icon to manage cookies */
      //"iconSrc": "", /* Optionnal: URL or base64 encoded image */
      "iconPosition": "TopRight",
      /* BottomRight, BottomLeft, TopRight and TopLeft */

      "adblocker": false,
      /* Show a Warning if an adblocker is detected */

      "DenyAllCta": true,
      /* Show the deny all button */
      "AcceptAllCta": true,
      /* Show the accept all button when highPrivacy on */
      "highPrivacy": true,
      /* HIGHLY RECOMMANDED Disable auto consent */

      "handleBrowserDNTRequest": false,
      /* If Do Not Track == 1, disallow all */

      "removeCredit": false,
      /* Remove credit link */
      "moreInfoLink": true,
      /* Show more info link */

      "useExternalCss": false,
      /* If false, the tarteaucitron.css file will be loaded */
      "useExternalJs": false,
      /* If false, the tarteaucitron.js file will be loaded */

      //"cookieDomain": ".my-multisite-domaine.fr", /* Shared cookie for multisite */

      "readmoreLink": "",
      /* Change the default readmore link */

      "mandatory": true,
      /* Show a message about mandatory cookies */
    });
  </script>
  <title>Kill Em'All</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  <link href="./style.css" rel="stylesheet">
  <link rel="icon" href="media/icon.png" />
</head>

<body>

  <div class="formulaire">
    <div id="youwin"></div>
    <!-- <form action="record.php" role="form" method="POST"> -->
    <form id="formulaire">
      <div class="form-group">
        <label for="name">Let's record your name !</label>
        <input type="text" name="name" id="name" class="form-control">
        <div id="erreur"></div>
      </div>
      <a href="index.php" type="button" class="btn btn-danger">Cancel</a>
      <button type="submit" name="submit" id="submit" class="btn btn-success">Save</button>
    </form>
  </div>

  <header>
    <h1>Kill Em'All</h1>
    <div class="score-container">
      <div id="computerScore"></div>
      <div id="lifePoint"></div>
      <div id="humanScore"></div>
    </div>
  </header>

  <canvas id="canvas" width="768px" height="768px"></canvas>

  <div class="scoreTable">
    <h3>BEST SCORES</h3><br>
    <ol class="score_maker">
      <?php $statement = $pdo->query('SELECT * FROM game ORDER BY score DESC LIMIT 10');
      $statement->execute();
      while ($score = $statement->fetch()) : ?>

        <li><?= $score['name'] ?>: <?= $score['score'] ?></li>

      <?php endwhile ?>
    </ol>
  </div>

  <script src="./script-min.js" type="module"></script>
</body>

</html>
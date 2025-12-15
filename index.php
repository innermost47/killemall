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
      "privacyUrl": "https://legals.anthony-charretier.fr/",
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
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

  <link href="./style.css" rel="stylesheet">
  <link rel="icon" href="./media/icon.png" />
</head>

<body>

  <div class="formulaire">
    <div id="youwin"></div>
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

  <div class="game-container">

    <div class="scoreTable">
      <div class="score-header">
        <h3>HALL OF FAME</h3>
        <p class="score-subtitle">TOP 10 WARRIORS</p>
      </div>

      <?php
      $statement = $pdo->query('SELECT * FROM game ORDER BY score DESC LIMIT 10');
      $scores = $statement->fetchAll(PDO::FETCH_ASSOC);
      if (count($scores) > 0) {
        echo '<ol class="score_maker">';
        foreach ($scores as $score) {
          echo "<li>{$score['name']}: {$score['score']}</li>";
        }
        echo '</ol>';
      } else {
        echo '<p class="text">
      The battlefield awaits...<br>
      Be the first to claim glory!
    </p>';
      }
      ?>

      <div class="separator"></div>

      <div class="scoreTable-footer">
        <div class="contact-section">
          <p class="contact-title">NEED SUPPORT?</p>
          <p class="contact-content">
            Contact the developer:<br>
            <a href="mailto:anthony.charretier@etik.com">anthony.charretier@etik.com</a>
          </p>
        </div>

        <div class="credits">
          <p>
            Game Design & Code<br>
            by Anthony Charretier<br><br>
            <a href="https://legals.anthony-charretier.fr" target="_blank">Legal Notice</a>
          </p>
          <a href="https://github.com/innermost47/killemall" target="_blank" class="github-link" title="View source on GitHub">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <header>
      <h1>Kill Em'All</h1>
      <div class="score-container">
        <div id="computerScore">Computer Score: 0</div>
        <div id="lifePoint">Life: 40</div>
        <div id="humanScore">Human Score: 0</div>
      </div>
    </header>

    <canvas id="canvas" width="768" height="768"></canvas>

  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
  <script src="script.js" type="module"></script>
</body>

</html>
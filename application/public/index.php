<?php
/**
 * This timezone used on local machine;
 */
date_default_timezone_set('Europe/Moscow');
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta property="og:title" content="BDO RU">
  <meta property="og:description" content="Сервис по отслеживанию доступности серверов Black Desert Online RU. Подробная статистика по дням/месяцам.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image:src" content="/bdo/images/<?= date('Y/n/j') ?>.png">
  <meta property="og:image" content="/bdo/favicon.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="128">
  <meta property="og:image:height" content="128">
  <link rel="canonical" href="https://projects.rmdir.dev/bdo/">
  
  <meta name="csrf-token" content="<?= $_SESSION['__token'] ?>">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="/bdo/favicon.ico">
  <link rel="stylesheet" href="./assets/main.css?<?= rand() ?>">
  <script defer type="module" src="./assets/main.js?<?= rand() ?>"></script>
  <title>BDO RU</title>
</head>

<body id="app" style="margin: 0;">
  <noscript>
    <div style="background-color: #212529; height: 100vh; width: 100vw; text-align: center; font-family: Roboto, Arial, sans-serif; color: rgba(255, 255, 255, .7); display: flex; justify-content: center; flex-direction: column;">
      <h1 style="margin: 0;">Sorry, this site requires <span style="color: white">javascript</span></h1>
      <p style="margin: .5rem;">Your browser does not support it or you have disabled it</p>
    </div>
  </noscript>
</body>

</html>
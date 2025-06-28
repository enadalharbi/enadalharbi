<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
}
$data = json_decode(file_get_contents('about_videos.json'), true);
?>
<div class="container">
  <h2>مرحبًا، <?= $_SESSION['user'] ?></h2>
  <a href="logout.php">تسجيل الخروج</a>
  <hr>
  <?php foreach ($data as $video): ?>
    <div class="card">
      <h3><?= $video['title'] ?></h3>
      <p>المنتج: <?= $video['producer'] ?> | التاريخ: <?= $video['release_date'] ?></p>
      <p>
        الطاقم:
        <?php foreach ($video['cast'] as $actor): ?>
          <?= $actor['name'] ?> (<?= $actor['role'] ?>),
        <?php endforeach; ?>
      </p>
      <video class="video-thumb" controls src="videos/<?= $video['filename'] ?>"></video>
    </div>
  <?php endforeach; ?>
</div>

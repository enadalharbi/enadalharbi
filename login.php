<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = new SQLite3('users.db');
    $username = $_POST['username'];
    $password = $_POST['password'];
    $result = $db->query("SELECT * FROM users WHERE username='$username' AND password='$password'");
    $user = $result->fetchArray(SQLITE3_ASSOC);
    if ($user) {
        $active = file('active_accounts.txt', FILE_IGNORE_NEW_LINES);
        if (in_array($user['code'], $active)) {
            $_SESSION['user'] = $username;
            header("Location: dashboard.php");
        } else {
            echo "الحساب غير موثق.";
        }
    } else {
        echo "بيانات خاطئة.";
    }
}
?>
<form method="post" class="container">
  <input name="username" placeholder="اسم المستخدم">
  <input name="password" type="password" placeholder="كلمة المرور">
  <button type="submit">تسجيل الدخول</button>
</form>

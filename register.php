<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = new SQLite3('users.db');
    $username = $_POST['username'];
    $password = $_POST['password'];
    $code = rand(100000, 999999);
    $stmt = $db->prepare("INSERT INTO users (username, password, code) VALUES (?, ?, ?)");
    $stmt->bindValue(1, $username);
    $stmt->bindValue(2, $password);
    $stmt->bindValue(3, $code);
    $stmt->execute();
    echo "تم التسجيل بنجاح. كود التوثيق: <strong>$code</strong>";
}
?>
<form method="post" class="container">
  <input name="username" placeholder="اسم المستخدم">
  <input name="password" type="password" placeholder="كلمة المرور">
  <button type="submit">تسجيل جديد</button>
</form>

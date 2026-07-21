<?php
require_once "includes/config.php";

if (isset($_SESSION["admin"])) {
    header("Location: dashboard.php");
    exit;
}

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $username = trim($_POST["username"] ?? "");
    $password = trim($_POST["password"] ?? "");

    if (
        $username === ADMIN_USERNAME &&
        $password === ADMIN_PASSWORD
    ) {

        $_SESSION["admin"] = true;
        $_SESSION["username"] = $username;

        header("Location: dashboard.php");
        exit;

    } else {

        $error = "Kullanıcı adı veya şifre hatalı.";

    }

}
?>
<!doctype html>
<html lang="tr">

<head>

<meta charset="utf-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1">

<title>Rise Craft Admin</title>

<link
href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css"
rel="stylesheet">

<link
href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
rel="stylesheet">

<link
href="assets/css/style.css"
rel="stylesheet">

</head>

<body class="login-body">

<div class="login-card">

<h2 class="mb-4 text-center">

🛡 Rise Craft Admin

</h2>

<?php if($error): ?>

<div class="alert alert-danger">

<?= $error ?>

</div>

<?php endif; ?>

<form method="post">

<div class="mb-3">

<label>Kullanıcı Adı</label>

<input
class="form-control"
name="username">

</div>

<div class="mb-4">

<label>Şifre</label>

<input
type="password"
class="form-control"
name="password">

</div>

<button
class="btn btn-warning w-100">

Giriş Yap

</button>

</form>

</div>

</body>

</html>
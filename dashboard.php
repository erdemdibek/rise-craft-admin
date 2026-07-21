<?php

require_once "includes/auth.php";
require_once "app/Services/ManifestService.php";

$manifestService = new ManifestService();

try {

    $manifest = $manifestService->get();

    $status = "🟢 GitHub bağlantısı başarılı";

} catch(Exception $e){

    $status = "🔴 ".$e->getMessage();

}
?>

<!doctype html>

<html lang="tr">

<head>

<meta charset="utf-8">

<title>Dashboard</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">

</head>

<body class="p-5">

<h2>Rise Craft Admin</h2>

<hr>

<h4><?= $status ?></h4>

<?php if(isset($manifest)): ?>

<div class="mt-4">

<b>Content Version</b>

<h3>

<?= $manifest["contentVersion"] ?>

</h3>

</div>

<?php endif; ?>

</body>

</html>
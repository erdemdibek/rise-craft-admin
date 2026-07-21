<?php

require_once __DIR__ . '/../Core/HttpClient.php';
require_once __DIR__ . '/../../includes/config.php';

class GithubService
{
    private HttpClient $http;

    public function __construct()
    {
        $this->http = new HttpClient();
    }

    public function getFile(string $path): array
    {
        $url =
            "https://raw.githubusercontent.com/" .
            GITHUB_OWNER . "/" .
            GITHUB_REPO . "/" .
            GITHUB_BRANCH . "/" .
            $path;

        $response = $this->http->get($url);

        if ($response["status"] != 200) {

            throw new Exception("Dosya okunamadı.");

        }

        return json_decode($response["body"], true);
    }

    public function getManifest(): array
    {
        return $this->getFile("manifest.json");
    }

    public function getRecipes(string $profession): array
    {
        return $this->getFile(
            "modules/recipes/$profession.json"
        );
    }
}
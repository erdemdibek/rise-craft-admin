<?php

require_once "GithubService.php";

class ManifestService
{
    private GithubService $github;

    public function __construct()
    {
        $this->github = new GithubService();
    }

    public function get(): array
    {
        return $this->github->getManifest();
    }
}
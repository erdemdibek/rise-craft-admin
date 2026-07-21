<?php

class HttpClient
{
    public function get(string $url): array
    {
        $ch = curl_init($url);

        curl_setopt_array($ch, [

            CURLOPT_RETURNTRANSFER => true,

            CURLOPT_HTTPHEADER => [

                'Accept: application/vnd.github+json',

                'User-Agent: RiseCraftAdmin'

            ]

        ]);

        $response = curl_exec($ch);

        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        return [

            'status'=>$status,

            'body'=>$response

        ];
    }
}
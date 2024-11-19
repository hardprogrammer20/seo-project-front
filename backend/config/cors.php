<?php 
return [

    /*
     |--------------------------------------------------------------------------
     | Laravel CORS Options
     |--------------------------------------------------------------------------
     |
     | Here you may configure your settings for CORS. Feel free to edit this
     | file as needed to suit your application.
     |
     */

    'paths' => ['*'], // Allow CORS for API routes and Sanctum

    'allowed_methods' => ['*'], 

    'allowed_origins' => ['http://localhost:3000'], 

    'allowed_headers' => ['*'],  

    'exposed_headers' => false,

    'max_age' => 0,

    'supports_credentials' => true,
];

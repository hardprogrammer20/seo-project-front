<?php

namespace App\Http\Controllers\SEO;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PerformanceScore extends Controller
{
    public function getTheScore(Request $request){
        # Getting the parameters from the link:
        $website = $request->input('website');
        $platform = $request->input("platform");
        # Target Url:
        $url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
        # Arranging parameters:
        $queryParams = [
            'url' => $website,
            'category' => 'performance',
            'strategy' => $platform,
        ];
        # Preparing cUrl:
        $queryString = http_build_query($queryParams);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url . '?' . $queryString);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        # Executing cUrl:
        $response = curl_exec($ch);
        # If there is error on cUrl:
        if(curl_errno($ch)) {
            return response()->json(['status' => 500, 'error' => curl_error($ch)], 500);
        }
        # Getting the response:
        curl_close($ch);
        $data = json_decode($response, true);
        # Check if the response exist the nodes:
        if (isset($data['lighthouseResult']) && isset($data['lighthouseResult']['categories']) && isset($data['lighthouseResult']['categories']["performance"]) && isset($data['lighthouseResult']['categories']["performance"]["score"]) ) {
            # Getting the score and sending the json to customer:
            $score = $data['lighthouseResult']['categories']["performance"]["score"];
            $score = $score * 100;
            return response()->json(
                [
                    "status" => 200,
                    "data" => $score
                ], 200
            );
        } else {
            # If there is no node, it will give error to the user.
            return response()->json(['error' => 'There is a problem with your websites url. Please, check it.'], 500);
        }
    }
}

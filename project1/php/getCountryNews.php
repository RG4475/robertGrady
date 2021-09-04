<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $startTimeExecution = microtime(true);
    $apiKey = "6c0b26539fed4568989ff9f0e3cc5da8";
    $url = 'https://newsapi.org/v2/top-headlines?country=' . $_REQUEST['countryISO2'] . '&apiKey=' . $apiKey;

    $ci = curl_init();
    curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ci, CURLOPT_URL, $url);

    $returned=curl_exec($ci);

    curl_close($ci);

    $decode = json_decode($returned, true);

    $countryArticles = [];

    foreach($decode['articles'] as $article) {
        $temp = null;
        $temp['source'] = $article['source']['name'];
        $temp['author'] = $article['author'];
        $temp['title'] = $article['title'];
        $temp['url'] = $article['url'];

        array_push($countryArticles, $temp);
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "OK";
    $output['status']['description'] = "Success";
    $output['status']['returnedIn'] = intval((microtime(true) - $startTimeExecution) * 1000) . "milliseconds";
    $output['data'] = $countryArticles;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
?>
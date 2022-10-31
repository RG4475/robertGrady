<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $startTimeExecution = microtime(true);
    $apiKey = "33b670cdcc3248ebbe8fc77c48aee290";
    $url = 'https://api.worldnewsapi.com/search-news?source-countries=' . $_REQUEST['countryAlt'] . '&number=20' . '&api-key=' . $apiKey;

    $ci = curl_init();
    curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ci, CURLOPT_URL, $url);

    $returned=curl_exec($ci);

    curl_close($ci);

    $decode = json_decode($returned, true);

    $countryArticles = [];

    foreach($decode['news'] as $article) {
        $temp = null;
        $temp['title'] = $article['title'];
        $temp['author'] = $article['author'];
        $temp['summary'] = $article['summary'];
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
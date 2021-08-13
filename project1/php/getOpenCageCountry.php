<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $startTimeExecution = microtime(true);
    $apiKey = "c102867c7a3145499be649e81878d2d4";
    $url = 'https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['countryName'] . '&key=' . $apiKey . '&language=en&pretty=1';
    //https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['countryName'] . '&key=' . $apiKey . '&language=en&pretty=1
    //Old URL https://api.opencagedata.com/geocode/v1/json?q=United%20Kingdom&key=c102867c7a3145499be649e81878d2d4&language=en&pretty=1

    $ci = curl_init();
    curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ci, CURLOPT_URL, $url);

    $returned=curl_exec($ci);

    curl_close($ci);

    $decode = json_decode($returned, true);

    $output['status']['code'] = $decode['status']['code'];
    $output['status']['message'] = $decode['status']['message'];
    $output['status']['apiCallsLimit'] = $decode['rate']['limit'];
    $output['status']['apiCallsRemaining'] = $decode['rate']['remaining'];
    $output['status']['returnedIn'] = intval((microtime(true) - $startTimeExecution) * 1000) . "milliseconds";
    $output['data'] = $decode['results'][0];

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
?>
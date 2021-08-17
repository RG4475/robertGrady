<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $startTimeExecution = microtime(true);

    $url = 'http://api.geonames.org/findNearbyWikipediaJSON?lat=' . $_REQUEST['latitude'] . '&lng=' . $_REQUEST['longitude'] . '&username=georobert55';

    $ci = curl_init();
    curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ci, CURLOPT_URL, $url);

    $returned=curl_exec($ci);

    curl_close($ci);

    $decode = json_decode($returned, true);

    $output['status']['code'] = "200";
    $output['status']['name'] = "OK";
    $output['status']['description'] = "Success";
    $output['status']['returnedIn'] = intval((microtime(true) - $startTimeExecution) * 1000) . "milliseconds";
    $output['data'] = $decode['geonames'];

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
?>
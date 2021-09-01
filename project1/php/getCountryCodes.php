<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $startTimeExecution = microtime(true);

    $countryData = json_decode(file_get_contents("../js/countryBorders.geo.json"), true);

    $country = [];

    foreach($countryData['features'] as $feature) {

        $temp = null;
        $temp['code'] = $feature["properties"]['iso_a3'];
        $temp['name'] = $feature["properties"]['name'];

        array_push($country, $temp);
    }

    usort($country, function($item1, $item2) {

        return $item1['name'] <=> $item2['name'];
    });

    
    /*
    $url='../js/countryBorders.geo.json';

    $ci = curl_init();
    curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ci, CURLOPT_URL, $url);

    $returned=curl_exec($ci);

    curl_close($ci);

    $returned = file_get_contents($url);
    $decode = json_decode($returned, true);

    */
    $output['status']['code'] = "200";
    $output['status']['name'] = "OK";
    $output['status']['description'] = "Success";
    $output['status']['returnedIn'] = intval((microtime(true) - $startTimeExecution) * 1000) . "milliseconds";
    $output['data'] = $country;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
?>
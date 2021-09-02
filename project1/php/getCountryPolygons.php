<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $startTimeExecution = microtime(true);

    $polygonData = json_decode(file_get_contents("../js/countryBorders.geo.json"), true);

    $border;

    foreach($polygonData['features'] as $feature) {

        if($feature["properties"]['iso_a3'] == $_REQUEST['countryCode']) {

            $border = $feature;
            break;
        }
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "OK";
    $output['status']['description'] = "Success";
    $output['status']['returnedIn'] = intval((microtime(true) - $startTimeExecution) * 1000) . "milliseconds";
    $output['data'] = $border;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
?>
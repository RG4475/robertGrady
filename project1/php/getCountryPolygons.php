<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $startTimeExecution = microtime(true);

    $countryCode = $_REQUEST['countryCode'];

    $polygonData = json_decode(file_get_contents("../js/countryBorders.geo.json"), true);

    //$polygonLength = $polygonData.length;

    $polygonType;
    $countryPolygons = [];
    $noOfCountries = count($polygonData['features']);
    $countryIndex;

    for($i = 0; $i < $noOfCountries; $i++)
    {
        if($countryCode == $polygonData['features'][$i]['properties']['iso_a3'])
        {
            $countryIndex = $i;
            break;
        }
    }
    $countryPolygons[0] = $polygonData['features'][$countryIndex]['geometry']['type'];
    $countryPolygons[1] = $polygonData['features'][$countryIndex]['geometry']['coordinates'];
    

    //$findCountry = array_search($countryCode, $polygonData['features']['properties']['']);

    $output['status']['code'] = "200";
    $output['status']['name'] = "OK";
    $output['status']['description'] = "Success";
    $output['status']['returnedIn'] = intval((microtime(true) - $startTimeExecution) * 1000) . "milliseconds";
    $output['data'] = $countryPolygons;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
?>
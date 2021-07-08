<?php
    ini_set('display_errors', "On");
    error_reporting(E_ALL);

    $startTimeExecution = microtime(true);

    $url='http://api.geonames.org/weatherIcaoJSON?ICAO='.$_REQUEST[''].'&username=georobert55';

    $ci = curl_init();
    curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ci, CURLOPT_URL, $url);

    $returned=curl_exec($ci);

    curl_close($ci);

    $decode = json_decode($returned, true);
?>
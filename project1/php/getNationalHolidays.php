<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $startTimeExecution = microtime(true);

    $url = 'https://calendarific.com/api/v2/holidays?&api_key=829bd63edef71d62c8b19dc433ba9dfe5844cf9b&country=' . $_REQUEST['countryISO2'] . '&year=' . date("Y");

    $ci = curl_init();
    curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ci, CURLOPT_URL, $url);

    $returned=curl_exec($ci);

    curl_close($ci);

    $decode = json_decode($returned, true);

    $countryHolidays = [];

    foreach($decode['response']['holidays'] as $holiday) {

        if($holiday['type'][0] == "National holiday")
        {
            $temp = null;
            $temp['name'] = $holiday['name'];
            $temp['date'] = $holiday['date']['iso'];
    
            array_push($countryHolidays, $temp);
        }

    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "OK";
    $output['status']['description'] = "Success";
    $output['status']['returnedIn'] = intval((microtime(true) - $startTimeExecution) * 1000) . "milliseconds";
    $output['data'] = $countryHolidays;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
    
?>
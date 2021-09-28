<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $startTimeExecution = microtime(true);
    
    $url = 'https://restcountries.com/v2/alpha/' . $_REQUEST['countryCode'];
    
    //http://api.countrylayer.com/v2/all?access_key=d73af0efb95e96d26b9b81800f9fc758
    //'https://restcountries.eu/rest/v2/alpha/' . $_REQUEST['countryCode'];

    $ci = curl_init();
    curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ci, CURLOPT_URL, $url);

    $returned=curl_exec($ci);

    curl_close($ci);

    $decode = json_decode($returned, true);

    /*
    $chosenCountry = [];

    foreach($decode as $country) {
        if($country['alpha3Code'] == $_REQUEST['countryCode'])
        {
            $temp = null;
            $temp = $country;

            array_push($chosenCountry, $temp);
        }
    }
    */
    

    $output['status']['code'] = "200";
    $output['status']['name'] = "OK";
    $output['status']['description'] = "Success";
    $output['status']['returnedIn'] = intval((microtime(true) - $startTimeExecution) * 1000) . "milliseconds";
    $output['data'] = $decode;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
?>
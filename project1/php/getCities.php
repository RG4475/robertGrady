<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $startTimeExecution = microtime(true);

    $url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=10&countryIds=' . $_REQUEST['iso2'];

    $ci = curl_init();
    curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ci, CURLOPT_URL, $url);
    curl_setopt($ci, CURLOPT_HTTPHEADER, ["x-rapidapi-host: wft-geo-db.p.rapidapi.com", "x-rapidapi-key: ede7189274msh504f908875ab55dp13b180jsn4f7d2fdab221"]);

    $returned=curl_exec($ci);

    curl_close($ci);

    $decode = json_decode($returned, true);

    $output['status']['code'] = "200";
    $output['status']['name'] = "OK";
    $output['status']['description'] = "Success";
    $output['status']['returnedIn'] = intval((microtime(true) - $startTimeExecution) * 1000) . "milliseconds";
    $output['data'] = $decode['data'];

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

/*
$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?location=54-2&limit=10",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"x-rapidapi-host: wft-geo-db.p.rapidapi.com",
		"x-rapidapi-key: ede7189274msh504f908875ab55dp13b180jsn4f7d2fdab221"
	],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
	echo "cURL Error #:" . $err;
} else {
	echo $response;
}
*/
?>
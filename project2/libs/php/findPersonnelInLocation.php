<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$startTimeExecution = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $startTimeExecution) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;
	}

    $sqlQuery = $conn->prepare('SELECT p.lastName, p.firstName, p.jobTitle, p.email, d.name AS department, l.name AS location, l.id AS locationID FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE l.id = ?');
    $sqlQuery->bind_param("i", $_GET['locationId']);
    $sqlQuery->execute();

	if (false === $sqlQuery) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		echo json_encode($output); 
	
		mysqli_close($conn);
		exit;

	}

	$result = $sqlQuery->get_result();
    $data = [];

    while ($row = mysqli_fetch_assoc($result)) {

        array_push($data, $row);
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $startTimeExecution) / 1000 . " ms";
    $output['data'] = $data;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

    mysqli_close($conn);
?>
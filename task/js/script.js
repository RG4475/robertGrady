$(window).on('load', function() {
    if($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function() {
            $(this).remove();
        });
    }
    $('#buttonAPI1').click(function() {
        $.ajax({
            url: "php/getWeatherICAO.php",
            type: 'POST',
            dataType: 'json',
            data: {
                ICAO: $('#enterICAO').val()
            },
            success: function(result){

                console.log(JSON.stringify(result));

                if(result.status.name == "OK")
                    {
                    $('#errorMsg').html("");
                    $('#field1').html("Airport ICAO Code: " + result['data']['ICAO']);
                    $('#field2').html("Station Name: " + result['data']['stationName']);
                    $('#field3').html("Country Code: " + result['data']['countryCode']);
                    $('#field4').html("Temperature: " + result['data']['temperature']);
                    $('#field5').html("Humidity: " + result['data']['humidity']);
                    $('#field6').html("Clouds: " + result['data']['clouds']);
                    $('#field7').html("Wind Speed: " + result['data']['windSpeed']);
                    $('#field8').html("Date/time of observation: " + result['data']['datetime']);
                }
            },

            error: function(jqXHR, textStatus, errorThrown) {
                JSON.stringify(jqXHR);
                JSON.stringify(textStatus);
                JSON.stringify(errorThrown);

                if(jqXHR.status == '204')
                {
                    $('#errorMsg').html(jqXHR.status + "No Response");
                }
                else if(jqXHR.status == '400')
                {
                    $('#errorMsg').html(jqXHR.status + "Bad Request");
                }
                else if(jqXHR.status == '401')
                {
                    $('#errorMsg').html(jqXHR.status + "Unauthorised Request");
                }
                else if(jqXHR.status == '403')
                {
                    $('#errorMsg').html(jqXHR.status + "Request Forbidden");
                }
                else if(jqXHR.status == '404')
                {
                    $('#errorMsg').html(jqXHR.status + "Request Not Found");
                }
                else if(jqXHR.status == '500')
                {
                    $('#errorMsg').html(jqXHR.status + "Internal Server Error");
                }
                else if(jqXHR.status == '503')
                {
                    $('#errorMsg').html(jqXHR.status + "Service Unavailable");
                }
                else if(textStatus == 'parsererror')
                {
                    $('#errorMsg').html(textStatus + " The ICAO code you entered is either incorrect or does not exist");
                }
            }
        });
    });

    $('#buttonAPI2').click(function() {
        $.ajax({
            url: "php/getEarthquakeInfo.php",
            type: 'POST',
            dataType: 'json',
            data: {
                north: $('#north1').val(),
                south: $('#south1').val(),
                east: $('#east1').val(),
                west: $('#west1').val()
            },
            success: function(result){

                console.log(JSON.stringify(result));

                if(result.status.name == "OK")
                {
                    $('#errorMsg').html("");

                    for(let i = 0; i < result['data'].length; i++)
                    {
                        let rowNum = i + 2;
                        $('tr.EarthquakeInfo:nth-child('+ rowNum +') td:nth-child(1)').html(result['data'][i]['datetime']);
                        $('tr.EarthquakeInfo:nth-child('+ rowNum +') td:nth-child(2)').html(result['data'][i]['depth']);
                        $('tr.EarthquakeInfo:nth-child('+ rowNum +') td:nth-child(3)').html(result['data'][i]['lng']);
                        $('tr.EarthquakeInfo:nth-child('+ rowNum +') td:nth-child(4)').html(result['data'][i]['magnitude']);
                        $('tr.EarthquakeInfo:nth-child('+ rowNum +') td:nth-child(5)').html(result['data'][i]['lat']);
                        $('tr.EarthquakeInfo:nth-child('+ rowNum +') td:nth-child(6)').html("");
                    }

                }
            },

            error: function(jqXHR, textStatus, errorThrown) {
                JSON.stringify(jqXHR);
                JSON.stringify(textStatus);
                JSON.stringify(errorThrown);

                if(jqXHR.status == '204')
                {
                    $('#errorMsg').html(jqXHR.status + "No Response");
                }
                else if(jqXHR.status == '400')
                {
                    $('#errorMsg').html(jqXHR.status + "Bad Request");
                }
                else if(jqXHR.status == '401')
                {
                    $('#errorMsg').html(jqXHR.status + "Unauthorised Request");
                }
                else if(jqXHR.status == '403')
                {
                    $('#errorMsg').html(jqXHR.status + "Request Forbidden");
                }
                else if(jqXHR.status == '404')
                {
                    $('#errorMsg').html(jqXHR.status + "Request Not Found");
                }
                else if(jqXHR.status == '500')
                {
                    $('#errorMsg').html(jqXHR.status + "Internal Server Error");
                }
                else if(jqXHR.status == '503')
                {
                    $('#errorMsg').html(jqXHR.status + "Service Unavailable");
                }
                else if(textStatus == 'parsererror')
                {
                    $('#errorMsg').html(textStatus + " The north, east, south and/or west coordinates you have entered are either incorrect or does not exist");
                }
            }
        });
    });

    $('#buttonAPI3').click(function() {
        $.ajax({
            url: "php/getOcean.php",
            type: 'POST',
            dataType: 'json',
            data: {
                lat: $('#enterLatitude').val(),
                lng: $('#enterLongitude').val()
            },
            success: function(result){

                console.log(JSON.stringify(result));

                if(result.status.name == "OK")
                {
                    $('#errorMsg').html("");
                    $('#field1').html("Ocean Name: " + result['data']['name']);
                    $('#field2').html("");
                    $('#field3').html("");
                    $('#field4').html("");
                    $('#field5').html("");
                    $('#field6').html("");
                    $('#field7').html("");
                    $('#field8').html("");
                }
            },

            error: function(jqXHR, textStatus, errorThrown) {
                JSON.stringify(jqXHR);
                JSON.stringify(textStatus);
                JSON.stringify(errorThrown);

                if(jqXHR.status == '204')
                {
                    $('#errorMsg').html(jqXHR.status + "No Response");
                }
                else if(jqXHR.status == '400')
                {
                    $('#errorMsg').html(jqXHR.status + "Bad Request");
                }
                else if(jqXHR.status == '401')
                {
                    $('#errorMsg').html(jqXHR.status + "Unauthorised Request");
                }
                else if(jqXHR.status == '403')
                {
                    $('#errorMsg').html(jqXHR.status + "Request Forbidden");
                }
                else if(jqXHR.status == '404')
                {
                    $('#errorMsg').html(jqXHR.status + "Request Not Found");
                }
                else if(jqXHR.status == '500')
                {
                    $('#errorMsg').html(jqXHR.status + "Internal Server Error");
                }
                else if(jqXHR.status == '503')
                {
                    $('#errorMsg').html(jqXHR.status + "Service Unavailable");
                }
                else if(textStatus == 'parsererror')
                {
                    $('#errorMsg').html(textStatus + " The latitude and/or longitude coordinates you have entered are either incorrect or does not exist");
                }
            }
        });
    });
});

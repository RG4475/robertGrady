var mymap = L.map('mapid');

$(window).on('load', function() {
    if($('#preloader').length) {
        $('#preloader').delay(500).fadeOut('slow', function() {
            $(this).remove();
        });
    }
    
    var currentPosMark;

    function showPositionInfo(position) {
        mymap.setView([position.coords.latitude, position.coords.longitude], 13);
        
    }

    function showPositionMarker(position) {
        currentPosMark = L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap);
    }

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPositionInfo);

        var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);

        navigator.geolocation.getCurrentPosition(showPositionMarker);
    }

    else {
        $('#errorMessage').html("Unfortunately your web browser does not support Geolocation");
    }

    $.ajax({
        url: "php/getCountryCodes.php",
        type: 'GET',
        dataType: 'json',

        success: function(result, status, xhr){
            console.log(JSON.stringify(result));

            if(result.status.name == "OK")
            {
                for(let i = 0; i < result['data'].length; i++)
                {
                    let optionNum = i + 1;
                    $('#countrySelect option:nth-child('+ optionNum +')').html(result['data'][i]['properties']['name']).attr("value", result['data'][i]['properties']['iso_a3']);
                    //Change attr("value") back to result['data'][i]['properties']['iso_a3']
                }

            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            JSON.stringify(jqXHR);

            if(jqXHR.status == '204')
            {
                $('#errorMessage').html(jqXHR.status + "No Response");
            }
            else if(jqXHR.status == '400')
            {
                $('#errorMessage').html(jqXHR.status + "Bad Request");
            }
            else if(jqXHR.status == '401')
            {
                $('#errorMessage').html(jqXHR.status + "Unauthorised Request");
            }
            else if(jqXHR.status == '403')
            {
                $('#errorMessage').html(jqXHR.status + "Request Forbidden"); 
            }
            else if(jqXHR.status == '404')
            {
                $('#errorMessage').html(jqXHR.status + "Request Not Found"); 
            }
            else if(jqXHR.status == '500')
            {
                $('#errorMessage').html(jqXHR.status + "Internal Server Error"); 
            }
            else if(jqXHR.status == '503')
            {
                $('#errorMessage').html(jqXHR.status + "Service Unavailable");
            }
        }
    });


});

$('#countrySelect').change(function() {

    $.ajax({
        url: "php/getCountryCodes.php",
        type: 'GET',
        dataType: 'json',
        
        success: function(result, status, xhr){
            console.log(JSON.stringify(result));

            let countryCoordinates = [];

            if(result.status.name == "OK")
            {
                let countryChosen = $('#countrySelect').val();

                let countryIndex;

                
                for(let i = 0; i < result['data'].length; i++)
                {
                    if(countryChosen == result['data'][i]['properties']['iso_a3']) //Change back to result['data'][i]['properties']['iso_a3']
                    {
                        countryIndex = i;
                        break;
                    }
                }
                countryCoordinates = result['data'][countryIndex]['geometry']['coordinates'];


                let polygonType = result['data'][countryIndex]['geometry']['type'];
                let countryPolygon;

                var geojsonFeature = {
                    "type": "Feature",
                    "geometry": {
                        "type": polygonType,
                        "coordinates": countryCoordinates
                    }
                };

                countryPolygon = L.geoJSON(geojsonFeature).addTo(mymap);
                mymap.fitBounds(countryPolygon.getBounds());
                
                
                //$('#errorMessage').html("Index of country" + countryCoordinates);
            }

            let countryISO3Code = $('#countrySelect').val();

            //Rest API
            let countryFullName;
            let countryCapital;
            let countryRegion;
            let countryPopulation;
            let countryLatitude;
            let countryLongitude;
            let countryCurrencyCode;
            let countryCurrencyName;
            let countryCurrencySymbol;
            let countryFlag;

            //Geonames API
            let wikipediaUrls = [];

            //OpenWeather API
            let mainWeather;
            let description;
            let currentTemperature;
            let temperatureCelsius; //Uses data from 'currentTemperature' variable and not OpenWeather API
            let temperatureFahrenheit; //Uses data from 'currentTemperature' variable and not OpenWeather API
            let feelsLike;
            let feelsLikeCelsius; //Uses data from 'feelsLike' variable and not OpenWeather API
            let feelsLikeFahrenheit; //Uses data from 'feelsLike' variable and not OpenWeather API
            let pressure;
            let humidity;
            let windSpeed;

            $.ajax({
                url: "php/getRestCountry.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    countryCode: countryISO3Code
                },
        
                success: function(result){
                    console.log(JSON.stringify(result));

                    if(result.status.name == "OK")
                    {
                        countryFullName = result['data']['name'];
                        countryCapital = result['data']['capital'];
                        countryRegion = result['data']['region'];
                        countryPopulation = result['data']['population'];

                        countryLatitude = result['data']['latlng'][0];
                        countryLongitude = result['data']['latlng'][1];

                        countryCurrencyCode = result['data']['currencies'][0]['code'];
                        countryCurrencyName = result['data']['currencies'][0]['name'];
                        countryCurrencySymbol = result['data']['currencies'][0]['symbol'];
                        countryFlag = result['data']['flag'];
                        
                    }
                    //$('#errorMessage').html(countryFlag);

                    $.ajax({
                        url: "php/getGeonameWikipedia.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            latitude: countryLatitude,
                            longitude: countryLongitude
                        },
        
                        success: function(result){
                            console.log(JSON.stringify(result));
        
                            if(result.status.name == "OK")
                            {
                                for(let i = 0; i < result['data'].length; i++)
                                {
                                    wikipediaUrls.push(result['data'][i]['wikipediaUrl']);
                                }
                                //$('#errorMessage').html(wikipediaUrls);
                            }

                            $.ajax({
                                url: "php/getCountryWeather.php",
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    latitude: countryLatitude,
                                    longitude: countryLongitude
                                },

                                success: function(result){
                                    console.log(JSON.stringify(result));

                                    if(result.status.name == "OK")
                                    {
                                        mainWeather = result['data']['weather'][0]['main'];
                                        description = result['data']['weather'][0]['description'];

                                        currentTemperature = result['data']['main']['temp'];
                                        temperatureCelsius = currentTemperature - 273.15;
                                        temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;

                                        feelsLike = result['data']['main']['feels_like'];
                                        feelsLikeCelsius = feelsLike - 273.15;
                                        feelsLikeFahrenheit = (feelsLikeCelsius * 9/5) + 32;

                                        pressure = result['data']['main']['pressure'];
                                        humidity = result['data']['main']['humidity'];
                                        windSpeed = result['data']['wind']['speed'];
                                        $('#errorMessage').html(temperatureFahrenheit);
                                    }
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    JSON.stringify(jqXHR);
                        
                                    if(jqXHR.status == '204')
                                    {
                                        $('#errorMessage').html(jqXHR.status + "OPEN WEATHER: No Response");
                                    }
                                    else if(jqXHR.status == '400')
                                    {
                                        $('#errorMessage').html(jqXHR.status + "OPEN WEATHER: Bad Request");
                                    }
                                    else if(jqXHR.status == '401')
                                    {
                                        $('#errorMessage').html(jqXHR.status + "OPEN WEATHER: Unauthorised Request");
                                    }
                                    else if(jqXHR.status == '403')
                                    {
                                        $('#errorMessage').html(jqXHR.status + "OPEN WEATHER: Request Forbidden"); 
                                    }
                                    else if(jqXHR.status == '404')
                                    {
                                        $('#errorMessage').html(jqXHR.status + "OPEN WEATHER: Request Not Found"); 
                                    }
                                    else if(jqXHR.status == '500')
                                    {
                                        $('#errorMessage').html(jqXHR.status + "OPEN WEATHER: Internal Server Error"); 
                                    }
                                    else if(jqXHR.status == '503')
                                    {
                                        $('#errorMessage').html(jqXHR.status + "OPEN WEATHER: Service Unavailable");
                                    }
                                }

                            });
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            JSON.stringify(jqXHR);
                
                            if(jqXHR.status == '204')
                            {
                                $('#errorMessage').html(jqXHR.status + "GEONAMES: No Response");
                            }
                            else if(jqXHR.status == '400')
                            {
                                $('#errorMessage').html(jqXHR.status + "GEONAMES: Bad Request");
                            }
                            else if(jqXHR.status == '401')
                            {
                                $('#errorMessage').html(jqXHR.status + "GEONAMES: Unauthorised Request");
                            }
                            else if(jqXHR.status == '403')
                            {
                                $('#errorMessage').html(jqXHR.status + "GEONAMES: Request Forbidden"); 
                            }
                            else if(jqXHR.status == '404')
                            {
                                $('#errorMessage').html(jqXHR.status + "GEONAMES: Request Not Found"); 
                            }
                            else if(jqXHR.status == '500')
                            {
                                $('#errorMessage').html(jqXHR.status + "GEONAMES: Internal Server Error"); 
                            }
                            else if(jqXHR.status == '503')
                            {
                                $('#errorMessage').html(jqXHR.status + "GEONAMES: Service Unavailable");
                            }
                        }
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    JSON.stringify(jqXHR);
        
                    if(jqXHR.status == '204')
                    {
                        $('#errorMessage').html(jqXHR.status + "REST COUNTRIES: No Response");
                    }
                    else if(jqXHR.status == '400')
                    {
                        $('#errorMessage').html(jqXHR.status + "REST COUNTRIES: Bad Request");
                    }
                    else if(jqXHR.status == '401')
                    {
                        $('#errorMessage').html(jqXHR.status + "REST COUNTRIES: Unauthorised Request");
                    }
                    else if(jqXHR.status == '403')
                    {
                        $('#errorMessage').html(jqXHR.status + "REST COUNTRIES: Request Forbidden"); 
                    }
                    else if(jqXHR.status == '404')
                    {
                        $('#errorMessage').html(jqXHR.status + "REST COUNTRIES: Request Not Found"); 
                    }
                    else if(jqXHR.status == '500')
                    {
                        $('#errorMessage').html(jqXHR.status + "REST COUNTRIES: Internal Server Error"); 
                    }
                    else if(jqXHR.status == '503')
                    {
                        $('#errorMessage').html(jqXHR.status + "REST COUNTRIES: Service Unavailable");
                    }
                }
                
            });
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            JSON.stringify(jqXHR);

            if(jqXHR.status == '204')
            {
                $('#errorMessage').html(jqXHR.status + "No Response");
            }
            else if(jqXHR.status == '400')
            {
                $('#errorMessage').html(jqXHR.status + "Bad Request");
            }
            else if(jqXHR.status == '401')
            {
                $('#errorMessage').html(jqXHR.status + "Unauthorised Request");
            }
            else if(jqXHR.status == '403')
            {
                $('#errorMessage').html(jqXHR.status + "Request Forbidden"); 
            }
            else if(jqXHR.status == '404')
            {
                $('#errorMessage').html(jqXHR.status + "Request Not Found"); 
            }
            else if(jqXHR.status == '500')
            {
                $('#errorMessage').html(jqXHR.status + "Internal Server Error"); 
            }
            else if(jqXHR.status == '503')
            {
                $('#errorMessage').html(jqXHR.status + "Service Unavailable");
            }
        }
    });


})
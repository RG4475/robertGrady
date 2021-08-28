var mymap = L.map('mapid');
let countryPolygon = null;

$(window).on('load', function() {
    if($('#preloader').length) {
        $('#preloader').delay(500).fadeOut('slow', function() {
            $(this).remove();
        });
    }
    
    var currentPosMark;

    function showPositionMarker(position) {
        currentPosMark = L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap);
    }

    function showPositionInfo(position) {

        var currentPosLat = position.coords.latitude;
        var currentPosLon = position.coords.longitude;

        $.ajax({
            url: "php/getCurrentLocCountry.php",
            type: 'POST',
            dataType: 'json',
            data: {
                currentLat: currentPosLat,
                currentLon: currentPosLon
            },

            success: function(result){
                console.log(JSON.stringify(result));

                var currentLocCountry;
                if(result.status.name == "OK")
                {
                    currentLocCountry = result['data'][0]['components']['ISO_3166-1_alpha-3'];
                    $('#countrySelect').val(currentLocCountry).change();
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
    }

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPositionMarker);

        var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);

        navigator.geolocation.getCurrentPosition(showPositionInfo);
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
                    if(countryChosen == result['data'][i]['properties']['iso_a3'])
                    {
                        countryIndex = i;
                        break;
                    }
                }
                countryCoordinates = result['data'][countryIndex]['geometry']['coordinates'];


                let polygonType = result['data'][countryIndex]['geometry']['type'];

                var geojsonFeature = {
                    "type": "Feature",
                    "geometry": {
                        "type": polygonType,
                        "coordinates": countryCoordinates
                    }
                };

                if(countryPolygon)
                {
                    countryPolygon.clearLayers();
                }

                countryPolygon = L.geoJSON(geojsonFeature).addTo(mymap);
                mymap.fitBounds(countryPolygon.getBounds());
            }

            let countryISO3Code = $('#countrySelect').val();

            //Rest API
            let countryFullName;
            let countryCapital;
            let countryRegion;
            let countryNativeName;
            let countryPopulation;
            let countryLanguage;
            let countryLanguageNativeName;
            let countryLatitude;
            let countryLongitude;
            let countryCurrencyCode;
            let countryCurrencyName;
            let countryCurrencySymbol;
            let countryFlag;

            //Geonames Wikipedia URLs API
            let wikipediaUrls = [];
            
            //Geonames Points of Interest API
            let poiLats = [];
            let poiLngs = [];
            let poiNames = [];
            let poiTypeClasses = [];
            let poiTypeNames = [];
            let poiMarkers = [];

            //Open Weather API
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

            //Open Exchange Rates API
            let currentCurrencyRates = [];


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
                        countryNativeName = result['data']['nativeName'];
                        countryPopulation = result['data']['population'];
                        countryLanguage = result['data']['languages'][0]['name'];
                        countryLanguageNativeName = result['data']['languages'][0]['nativeName'];

                        countryLatitude = result['data']['latlng'][0];
                        countryLongitude = result['data']['latlng'][1];

                        countryCurrencyCode = result['data']['currencies'][0]['code'];
                        countryCurrencyName = result['data']['currencies'][0]['name'];
                        countryCurrencySymbol = result['data']['currencies'][0]['symbol'];
                        countryFlag = result['data']['flag'];
                        
                    }

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
                                        temperatureCelsius = Math.round(currentTemperature - 273.15);
                                        temperatureFahrenheit = Math.round((temperatureCelsius * 9/5) + 32);

                                        feelsLike = result['data']['main']['feels_like'];
                                        feelsLikeCelsius = Math.round(feelsLike - 273.15);
                                        feelsLikeFahrenheit = Math.round((feelsLikeCelsius * 9/5) + 32);

                                        pressure = result['data']['main']['pressure'];
                                        humidity = result['data']['main']['humidity'];
                                        windSpeed = result['data']['wind']['speed'];
                                    }

                                    $.ajax({
                                        url: "php/getPointsOfInterest.php",
                                        type: 'POST',
                                        dataType: 'json',
                                        data: {
                                            latitude: 37.451,
                                            longitude: -122.18
                                        },

                                        success: function(result){
                                            console.log(JSON.stringify(result));

                                            if(result.status.name == "OK")
                                            {
                                                //$('#errorMessage').html(result['data'][0]['typeClass']);

                                                for(let i = 0; i < result['data'].length; i++)
                                                {
                                                    poiLats.push(result['data'][i]['lat']);
                                                    poiLngs.push(result['data'][i]['lng']);
                                                    poiNames.push(result['data'][i]['name']);
                                                    poiTypeClasses.push(result['data'][i]['typeClass']);
                                                    poiTypeNames.push(result['data'][i]['typeName']);

                                                    poiMarkers.push(L.marker([poiLats[i], poiLngs[i]]).addTo(mymap));
                                                }

                                                
                                                $('#errorMessage').html(poiLats[0] + " " + poiLngs[0]);
                                                
                                            }

                                            $.ajax({
                                                url: "php/getExchangeRates.php",
                                                type: 'POST',
                                                dataType: 'json',
                                                data: {
                                                    currencyCode: countryCurrencyCode
                                                },
        
                                                success: function(result){
                                                    console.log(JSON.stringify(result));
        
                                                    if(result.status.name == "OK")
                                                    {
                                                        for(let property in result['data']['rates'])
                                                        {
                                                            currentCurrencyRates.push(`${property}: ${result['data']['rates'][property]}`);
                                                        }


        
                                                        $('#selectedCountry').html(countryFullName);
                                                        $('#flag').attr("src", countryFlag);
                                                        $('#capitalCity').html(`Capital city:  ${countryCapital}`);
                                                        $('#population').html(`Population:  ${countryPopulation}`);
                                                        $('#nativeName').html(`Native name:  ${countryNativeName}`);
                                                        $('#region').html(`Region: ${countryRegion}`);
                                                        $('#language').html(`Language: ${countryLanguage} (${countryLanguageNativeName})`);
                                                        $('#currentTemperature').html(`Current temperature: ${temperatureFahrenheit}&#8457;/ ${temperatureCelsius}&#8451;`);
                                                        $('#feelsLike').html(`Feels like: ${feelsLikeFahrenheit}&#8457;/ ${feelsLikeCelsius}&#8451;`);
                                                        $('#weather').html(`Weather: ${mainWeather} (${description})`);
                                                        $('#pressure').html(`Pressure: ${pressure}`);
                                                        $('#humidity').html(`Humidity: ${humidity}`);
                                                        $('#windSpeed').html(`Wind speed: ${windSpeed}`);
        
                                                        for(let i = 0; i < wikipediaUrls.length; i++)
                                                        {
                                                            let linkNo = i + 1;
                                                            $('#wikipediaLinks li:nth-child(' + linkNo + ') a').attr("href", "https://" + wikipediaUrls[i]).html("https://" + wikipediaUrls[i]);
                                                            
                                                        }
        
                                                        $('#currency').html(`Currency: ${countryCurrencyName} (${countryCurrencyCode})`);
                                                        $('#exchangeRates li:nth-child(1)').html(currentCurrencyRates[7]);
                                                        $('#exchangeRates li:nth-child(2)').html(currentCurrencyRates[21]);
                                                        $('#exchangeRates li:nth-child(3)').html(currentCurrencyRates[26]);
                                                        $('#exchangeRates li:nth-child(4)').html(currentCurrencyRates[46]);
                                                        $('#exchangeRates li:nth-child(5)').html(currentCurrencyRates[49]);
                                                        $('#exchangeRates li:nth-child(6)').html(currentCurrencyRates[73]);
                                                        $('#exchangeRates li:nth-child(7)').html(currentCurrencyRates[109]);
                                                        $('#exchangeRates li:nth-child(8)').html(currentCurrencyRates[150]);

                                                        var myModal = new bootstrap.Modal(document.getElementById('countryModal'), {
                                                            backdrop: true,
                                                            keyboard: true,
                                                            focus: true
                                                        });

                                                        myModal.show();
                                                    }
                                                },
                                                error: function(jqXHR, textStatus, errorThrown) {
                                                    JSON.stringify(jqXHR);
                                        
                                                    if(jqXHR.status == '204')
                                                    {
                                                        $('#errorMessage').html(jqXHR.status + "OPEN EXCHANGE RATES: No Response");
                                                    }
                                                    else if(jqXHR.status == '400')
                                                    {
                                                        $('#errorMessage').html(jqXHR.status + "OPEN EXCHANGE RATES: Bad Request");
                                                    }
                                                    else if(jqXHR.status == '401')
                                                    {
                                                        $('#errorMessage').html(jqXHR.status + "OPEN EXCHANGE RATES: Unauthorised Request");
                                                    }
                                                    else if(jqXHR.status == '403')
                                                    {
                                                        $('#errorMessage').html(jqXHR.status + "OPEN EXCHANGE RATES: Request Forbidden"); 
                                                    }
                                                    else if(jqXHR.status == '404')
                                                    {
                                                        $('#errorMessage').html(jqXHR.status + "OPEN EXCHANGE RATES: Request Not Found"); 
                                                    }
                                                    else if(jqXHR.status == '500')
                                                    {
                                                        $('#errorMessage').html(jqXHR.status + "OPEN EXCHANGE RATES: Internal Server Error"); 
                                                    }
                                                    else if(jqXHR.status == '503')
                                                    {
                                                        $('#errorMessage').html(jqXHR.status + "OPEN EXCHANGE RATES: Service Unavailable");
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
});
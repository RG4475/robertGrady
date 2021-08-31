var mymap = L.map('mapid');
let countryPolygon = null;
var cityMarkers = null;

$(window).on('load', function() {
    if($('#preloader').length) {
        $('#preloader').delay(500).fadeOut('slow', function() {
            $(this).remove();
        });
    }
    
    var homeMarker = L.AwesomeMarkers.icon({
        markerColor: 'green',
      });
    var currentPosMark;

    function showPositionMarker(position) {
        currentPosMark = L.marker([position.coords.latitude, position.coords.longitude], {icon: homeMarker}).bindPopup("Current Location").addTo(mymap);
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
            let countryISO2Code;
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

            //Geonames API
            let wikipediaUrls = [];
            
            //GeoDB Cities API
            let cityLats = [];
            let cityLngs = [];
            let cityNames = [];

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
                        countryISO2Code = result['data']['alpha2Code'];
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

                        //$('#errorMessage').html(countryISO2Code);
                        
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
                                        url: "php/getCities.php",
                                        type: 'POST',
                                        dataType: 'json',
                                        data: {
                                            iso2: countryISO2Code
                                        },

                                        success: function(result){
                                            console.log(JSON.stringify(result));

                                            if(result.status.name == "OK")
                                            {
                                                //$('#errorMessage').html(result['data'][0]['typeClass']);

                                                for(let i = 0; i < result['data'].length; i++)
                                                {
                                                    cityLats.push(result['data'][i]['latitude']);
                                                    cityLngs.push(result['data'][i]['longitude']);
                                                    cityNames.push(result['data'][i]['name']);

                                                    //cityMarkers.push(L.marker([cityLats[i], cityLngs[i]]).addTo(mymap));
                                                }

                                                if(cityMarkers)
                                                {
                                                    cityMarkers.clearLayers();
                                                }
                                                var redMarker = L.AwesomeMarkers.icon({
                                                    markerColor: 'red'
                                                  });

                                                cityMarkers = L.markerClusterGroup();

                                                for(let i = 0; i < result['data'].length; i++)
                                                {
                                                    cityMarkers.addLayer(L.marker([cityLats[i], cityLngs[i]], {icon: redMarker}).bindPopup(cityNames[i]));
                                                    
                                                }

                                                mymap.addLayer(cityMarkers);

                                                
                                                $('#errorMessage').html(cityNames);
                                                
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

                                                        //$('#errorMessage').html(currentCurrencyRates.length);

        
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
                                                        $('#majorRates li:nth-child(1)').html(currentCurrencyRates[7]);
                                                        $('#majorRates li:nth-child(2)').html(currentCurrencyRates[21]);
                                                        $('#majorRates li:nth-child(3)').html(currentCurrencyRates[26]);
                                                        $('#majorRates li:nth-child(4)').html(currentCurrencyRates[46]);
                                                        $('#majorRates li:nth-child(5)').html(currentCurrencyRates[49]);
                                                        $('#majorRates li:nth-child(6)').html(currentCurrencyRates[73]);
                                                        $('#majorRates li:nth-child(7)').html(currentCurrencyRates[109]);
                                                        $('#majorRates li:nth-child(8)').html(currentCurrencyRates[150]);

                                                        for(let i = 0; i < currentCurrencyRates.length; i++)
                                                        {
                                                            let currencyNo = i + 1;
                                                            $('#allRates li:nth-child(' + currencyNo + ')').html(currentCurrencyRates[i]);
                                                        }

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
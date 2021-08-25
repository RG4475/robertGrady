var mymap = L.map('mapid');
let countryPolygon = null;

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

        var currentPosLat = position.coords.latitude;
        var currentPosLon = position.coords.longitude;

        $.ajax({
            url: "php/getCountryWeather.php",
            type: 'POST',
            dataType: 'json',
            data: {
                latitude: currentPosLat,
                longitude: currentPosLon
            },

            success: function(result){
                console.log(JSON.stringify(result));

                if(result.status.name == "OK")
                {
                    var localTemperature = result['data']['main']['temp'];
                    var localTempCelsius = Math.round(localTemperature - 273.15);
                    var localTempFahrenheit = Math.round((localTempCelsius * 9/5) + 32);

                    var localFeelsLike = result['data']['main']['feels_like'];
                    var localFeelsCelsius = Math.round(localFeelsLike - 273.15);
                    var localFeelsFahrenheit = Math.round((localFeelsCelsius * 9/5) + 32);

                    currentPosMark = L.popup()
                        .setLatLng([currentPosLat, currentPosLon])
                        .setContent("<h5>Current weather in local area</h5>" + 
                        "Weather: " + result['data']['weather'][0]['main'] + " (" + result['data']['weather'][0]['description'] + ")<br>" +
                        "Temperature: " + localTempFahrenheit + "&#8457; " + localTempCelsius  + "&#8451; <br>" +
                        "Feels Like: " + localFeelsFahrenheit  + "&#8457; " + localFeelsCelsius  + "&#8451; <br>" +
                        "Pressure " + result['data']['main']['pressure'] + "<br>" +
                        "Humidity " + result['data']['main']['humidity'] + "<br>" +
                        "Wind Speed " + result['data']['wind']['speed']
                        )
                        .openOn(mymap);
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

            //Geonames API
            let wikipediaUrls = [];

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

                                                var countryPopup = L.popup()
                                                    .setLatLng([countryLatitude, countryLongitude])
                                                    .setContent("<h5>" + countryFullName + "     " +
                                                    "<img id=\"flag\" src=\"" + countryFlag + "\" height=\"50\" width=\"100\"/></h5>" + 
                                                    "Capital City: " + countryCapital + "<br>" + 
                                                    "Population: " + countryPopulation + "<br>" + 
                                                    "Native Name: " + countryNativeName + "<br>" +
                                                    "Region: " + countryRegion + "<br>" + 
                                                    "Language: " + countryLanguage + " (" + countryLanguageNativeName + ")<br><br>" +
                                                    "Current Temperature: " + temperatureFahrenheit + "&#8457; " + temperatureCelsius + "&#8451; <br>" + 
                                                    "Feels Like: " + feelsLikeFahrenheit + "&#8457; " + feelsLikeCelsius + "&#8451; <br>" + 
                                                    "Weather: " + mainWeather + " (" + description + ")<br>" +
                                                    "Pressure: " + pressure + "<br>" +
                                                    "Humidity: " + humidity + "<br>" +
                                                    "Wind Speed: " + windSpeed + "<br><br>" + 
                                                    "<a href=\"" + wikipediaUrls[0] + "\" >" + wikipediaUrls[0] + "</a>" + "<br>" +
                                                    "<a href=\"" + wikipediaUrls[1] + "\" >" + wikipediaUrls[1] + "</a>" + "<br>" +
                                                    "<a href=\"" + wikipediaUrls[2] + "\" >" + wikipediaUrls[2] + "</a>" + "<br>" +
                                                    "<a href=\"" + wikipediaUrls[3] + "\" >" + wikipediaUrls[3] + "</a>" + "<br>" +
                                                    "<a href=\"" + wikipediaUrls[4] + "\" >" + wikipediaUrls[4] + "</a>" + "<br><br>" +
                                                    "Currency: " + countryCurrencyName + " (" + countryCurrencyCode + ")<br>" +
                                                    currentCurrencyRates[7] + "<br>" +
                                                    currentCurrencyRates[21] + "<br>" + 
                                                    currentCurrencyRates[26] + "<br>" +
                                                    currentCurrencyRates[46] + "<br>" +
                                                    currentCurrencyRates[49] + "<br>" + 
                                                    currentCurrencyRates[73] + "<br>" +
                                                    currentCurrencyRates[109] + "<br>" +
                                                    currentCurrencyRates[150]
                                                    )
                                                    .openOn(mymap);
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
var mymap = L.map('mapid');
var border = null;
var cityMarkers = null;

$(window).on('load', function() {
    if($('#preloader').length) {
        $('#preloader').delay(500).fadeOut('slow', function() {
            $(this).remove();
        });
    }
    
    var homeMarker = L.AwesomeMarkers.icon({
        prefix: 'fa',
        icon: 'fas fa-map-pin',
        markerColor: 'green'
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

        var infoModal = new bootstrap.Modal(document.getElementById('infoModal'), {
            backdrop: true,
            keyboard: true,
            focus: true
        });

        var weatherModal = new bootstrap.Modal(document.getElementById('weatherModal'), {
            backdrop: true,
            keyboard: true,
            focus: true
        });

        var covidModal = new bootstrap.Modal(document.getElementById('covidModal'), {
            backdrop: true,
            keyboard: true,
            focus: true
        });

        var holidayModal = new bootstrap.Modal(document.getElementById('holidayModal'), {
            backdrop: true,
            keyboard: true,
            focus: true
        });

        var newsModal = new bootstrap.Modal(document.getElementById('newsModal'), {
            backdrop: true,
            keyboard: true,
            focus: true
        });

        var ratesModal = new bootstrap.Modal(document.getElementById('ratesModal'), {
            backdrop: true,
            keyboard: true,
            focus: true
        });

        L.easyButton('fa-info', function() {
            infoModal.show();
        }).addTo(mymap);

        L.easyButton('fa-cloud-sun-rain', function() {
            weatherModal.show();
        }).addTo(mymap);

        L.easyButton('fa-virus', function() {
            covidModal.show();
        }).addTo(mymap);

        L.easyButton('fa-gifts', function() {
            holidayModal.show();
        }).addTo(mymap);

        L.easyButton('fa-newspaper', function() {
            newsModal.show();
        }).addTo(mymap);

        L.easyButton('fa-pound-sign', function() {
            ratesModal.show();
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
                $('.leaflet-pane .leaflet-tooltip-pane').append($('h4#h4Country'));
                $('.leaflet-pane .leaflet-tooltip-pane h4').add($('select'));
                for(let i = 0; i < result['data'].length; i++)
                {
                    let optionNum = i + 1;
                    $('#countrySelect').add($('option'));
                    $('#countrySelect option:nth-child('+ optionNum +')').html(result['data'][i]['name']).attr("value", result['data'][i]['code']);
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
        url: "php/getCountryPolygons.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: $('#countrySelect').val()
        },
        
        success: function(result, status, xhr){
            console.log(JSON.stringify(result));

            if(result.status.name == "OK")
            {
                if(mymap.hasLayer(border)) {
                    mymap.removeLayer(border);
                }

                border = L.geoJson(result.data, {
                    color: '#ff7800',
                    weight: 2,
                    opacity: 0.65
                }).addTo(mymap);

                mymap.fitBounds(border.getBounds());
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

            //Corona API
            let todayDeaths;
            let todayCases;
            let totalDeaths;
            let totalCases;
            let totalRecovered;
            let totalCritical;
            let deathRate;
            let recoveryRate;
            let casesPerMillionPopulation;

            //Calendarific API
            let holidayDates = [];

            //News API
            let newsArticles = [];


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
                                    wikipediaUrls.push(result['data'][i]);
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

                                                for(let i = 0; i < result['data'].length; i++)
                                                {
                                                    cityLats.push(result['data'][i]['latitude']);
                                                    cityLngs.push(result['data'][i]['longitude']);
                                                    cityNames.push(result['data'][i]['name']);

                                                }

                                                if(cityMarkers)
                                                {
                                                    cityMarkers.clearLayers();
                                                }
                                                var redMarker = L.AwesomeMarkers.icon({
                                                    prefix: 'fa',
                                                    icon: 'fas fa-location-arrow',
                                                    markerColor: 'red'
                                                  });

                                                cityMarkers = L.markerClusterGroup();

                                                for(let i = 0; i < result['data'].length; i++)
                                                {
                                                    cityMarkers.addLayer(L.marker([cityLats[i], cityLngs[i]], {icon: redMarker}).bindPopup(cityNames[i]));
                                                    
                                                }

                                                mymap.addLayer(cityMarkers);
                                                
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

        
                                                        $('.selectedCountry').html(countryFullName);
                                                        $('.flag').attr("src", countryFlag);
                                                        $('#capitalCity').html(countryCapital);
                                                        $('#population').html(countryPopulation);
                                                        $('#nativeName').html(countryNativeName);
                                                        $('#region').html(countryRegion);
                                                        $('#language').html(`${countryLanguage} (${countryLanguageNativeName})`);
                                                        $('#currentTemperature').html(`${temperatureFahrenheit}&#8457;/ ${temperatureCelsius}&#8451;`);
                                                        $('#feelsLike').html(`${feelsLikeFahrenheit}&#8457;/ ${feelsLikeCelsius}&#8451;`);
                                                        $('#weather').html(`${mainWeather} (${description})`);
                                                        $('#pressure').html(pressure);
                                                        $('#humidity').html(humidity);
                                                        $('#windSpeed').html(windSpeed);
        
                                                        for(let i = 0; i < wikipediaUrls.length; i++)
                                                        {
                                                            let linkNo = i + 1;
                                                            $('#wikipediaLinks li:nth-child(' + linkNo + ') a').attr("href", "https://" + wikipediaUrls[i]).html("https://" + wikipediaUrls[i]);
                                                        }
        
                                                        $('#currency').html(`${countryCurrencyName} (${countryCurrencyCode})`);

                                                        let majori = 1;

                                                        for(let majorCurrency in result['data']['rates']) {

                                                            if(majorCurrency == "AUD" || majorCurrency == "BTC" || majorCurrency == "CAD" || majorCurrency == "EUR" || majorCurrency == "GBP" || majorCurrency == "JPY" || majorCurrency == "NZD" || majorCurrency == "USD")
                                                            {
                                                                $('#majorRates tr:nth-child(' + majori + ') td:nth-child(1)').html(majorCurrency);
                                                                $('#majorRates tr:nth-child(' + majori + ') td:nth-child(2)').html(result['data']['rates'][majorCurrency]);

                                                                majori++;
                                                            }
                                                        }

                                                        let allCurri = 1;

                                                        for(let allCurrency in result['data']['rates']) {
                                                            $('#allRates tr:nth-child(' + allCurri + ') td:nth-child(1)').html(allCurrency);
                                                            $('#allRates tr:nth-child(' + allCurri + ') td:nth-child(2)').html(result['data']['rates'][allCurrency]);
                                                            
                                                            allCurri++;
                                                        }

                                                        $.ajax({
                                                            url: "php/getCovidData.php",
                                                            type: 'POST',
                                                            dataType: 'json',
                                                            data: {
                                                                countryISO2: countryISO2Code
                                                            },

                                                            success: function(result) {
                                                                console.log(JSON.stringify(result));

                                                                if(result.status.name == "OK") 
                                                                {
                                                                    todayDeaths = result['todaysData']['deaths'];
                                                                    todayCases = result['todaysData']['confirmed'];
                                                                    totalDeaths = result['totalData']['deaths'];
                                                                    totalCases = result['totalData']['confirmed'];
                                                                    totalRecovered = result['totalData']['recovered'];
                                                                    totalCritical = result['totalData']['critical'];
                                                                    deathRate = result['totalData']['calculated']['death_rate'];
                                                                    recoveryRate = result['totalData']['calculated']['recovery_rate'];
                                                                    casesPerMillionPopulation = result['totalData']['calculated']['cases_per_million_population'];
                                                                    //$('#errorMessage').html(casesPerMillionPopulation);

                                                                    $('#todayCases').html(todayCases);
                                                                    $('#todayDeaths').html(todayDeaths);
                                                                    $('#totalCases').html(totalCases);
                                                                    $('#totalDeaths').html(totalDeaths);
                                                                    $('#totalRecovered').html(totalRecovered);
                                                                    $('#totalCritical').html(totalCritical);
                                                                    $('#deathRate').html(deathRate);
                                                                    $('#recoveryRate').html(recoveryRate);
                                                                    $('#casesPerMillion').html(casesPerMillionPopulation);
                                                                }

                                                                $.ajax({
                                                                    url: "php/getNationalHolidays.php",
                                                                    type: 'POST',
                                                                    dataType: 'json',
                                                                    data: {
                                                                        countryISO2: countryISO2Code
                                                                    },

                                                                    success: function(result) {
                                                                        console.log(JSON.stringify(result));

                                                                        if(result.status.name == "OK")
                                                                        {
                                                                            let totalNationalHolidays = result['data'].length;
                                                                            $('#holidayTable tr:nth-child(1) th:nth-child(2)').html(totalNationalHolidays);

                                                                            for(let i = 1; i <= 30; i++)
                                                                            {
                                                                                $('#holidayTable tbody tr:nth-child(' + i +') td:nth-child(1)').empty();
                                                                                $('#holidayTable tbody tr:nth-child(' + i + ') td:nth-child(2)').empty();
                                                                            }

                                                                            for(let i = 0; i < totalNationalHolidays; i++)
                                                                            {
                                                                                let holidayNo = i + 1;

                                                                                if(countryISO3Code == "USA")
                                                                                {
                                                                                    $('#holidayTable tbody tr:nth-child(' + holidayNo +') td:nth-child(1)').html(Date.parse(result['data'][i]['date']).toString("M/d/yyyy"));
                                                                                }
                                                                                else
                                                                                {
                                                                                    $('#holidayTable tbody tr:nth-child(' + holidayNo +') td:nth-child(1)').html(Date.parse(result['data'][i]['date']).toString("d/M/yyyy"));
                                                                                }

                                                                                $('#holidayTable tbody tr:nth-child(' + holidayNo + ') td:nth-child(2)').html(result['data'][i]['name']);
                                                                            }
                                                                        }

                                                                        $.ajax({
                                                                            url: "php/getCountryNews.php",
                                                                            type: 'POST',
                                                                            dataType: 'json',
                                                                            data: {
                                                                                countryISO2: countryISO2Code
                                                                            },

                                                                            success: function(result) {
                                                                                console.log(JSON.stringify(result));

                                                                                if(result.status.name == "OK")
                                                                                {
                                                                                    for(let i = 0; i < result['data'].length; i++)
                                                                                    {
                                                                                        let newsNo = i + 1;

                                                                                        $('.recentNews:nth-child(' + newsNo +') tr:nth-child(1) th a').html(result['data'][i]['title']);
                                                                                        $('.recentNews:nth-child(' + newsNo +') tr:nth-child(1) th a').attr("href", result['data'][i]['url']);
                                                                                        $('.recentNews:nth-child(' + newsNo + ') tr:nth-child(2) td:nth-child(2)').html(result['data'][i]['source']);
                                                                                        $('.recentNews:nth-child(' + newsNo + ') tr:nth-child(3) td:nth-child(2)').html(result['data'][i]['author']);
                                                                                    }
                                                                                }
                                                                            },
                                                                            error: function(jqXHR, textStatus, errorThrown) {
                                                                                JSON.stringify(jqXHR);
                                                                    
                                                                                if(jqXHR.status == '204')
                                                                                {
                                                                                    $('#errorMessage').html(jqXHR.status + "NEWS API: No Response");
                                                                                }
                                                                                else if(jqXHR.status == '400')
                                                                                {
                                                                                    $('#errorMessage').html(jqXHR.status + "NEWS API: Bad Request");
                                                                                }
                                                                                else if(jqXHR.status == '401')
                                                                                {
                                                                                    $('#errorMessage').html(jqXHR.status + "NEWS API: Unauthorised Request");
                                                                                }
                                                                                else if(jqXHR.status == '403')
                                                                                {
                                                                                    $('#errorMessage').html(jqXHR.status + "NEWS API: Request Forbidden"); 
                                                                                }
                                                                                else if(jqXHR.status == '404')
                                                                                {
                                                                                    $('#errorMessage').html(jqXHR.status + "NEWS API: Request Not Found"); 
                                                                                }
                                                                                else if(jqXHR.status == '500')
                                                                                {
                                                                                    $('#errorMessage').html(jqXHR.status + "NEWS API: Internal Server Error"); 
                                                                                }
                                                                                else if(jqXHR.status == '503')
                                                                                {
                                                                                    $('#errorMessage').html(jqXHR.status + "NEWS API: Service Unavailable");
                                                                                }
                                                                            }
                                                                        });
                                                                    },
                                                                    error: function(jqXHR, textStatus, errorThrown) {
                                                                        JSON.stringify(jqXHR);
                                                            
                                                                        if(jqXHR.status == '204')
                                                                        {
                                                                            $('#errorMessage').html(jqXHR.status + "CALENDARIFIC: No Response");
                                                                        }
                                                                        else if(jqXHR.status == '400')
                                                                        {
                                                                            $('#errorMessage').html(jqXHR.status + "CALENDARIFIC: Bad Request");
                                                                        }
                                                                        else if(jqXHR.status == '401')
                                                                        {
                                                                            $('#errorMessage').html(jqXHR.status + "CALENDARIFIC: Unauthorised Request");
                                                                        }
                                                                        else if(jqXHR.status == '403')
                                                                        {
                                                                            $('#errorMessage').html(jqXHR.status + "CALENDARIFIC: Request Forbidden"); 
                                                                        }
                                                                        else if(jqXHR.status == '404')
                                                                        {
                                                                            $('#errorMessage').html(jqXHR.status + "CALENDARIFIC: Request Not Found"); 
                                                                        }
                                                                        else if(jqXHR.status == '500')
                                                                        {
                                                                            $('#errorMessage').html(jqXHR.status + "CALENDARIFIC: Internal Server Error"); 
                                                                        }
                                                                        else if(jqXHR.status == '503')
                                                                        {
                                                                            $('#errorMessage').html(jqXHR.status + "CALENDARIFIC: Service Unavailable");
                                                                        }
                                                                    }
                                                                });
                                                            },
                                                            error: function(jqXHR, textStatus, errorThrown) {
                                                                JSON.stringify(jqXHR);
                                                    
                                                                if(jqXHR.status == '204')
                                                                {
                                                                    $('#errorMessage').html(jqXHR.status + "CORONA API: No Response");
                                                                }
                                                                else if(jqXHR.status == '400')
                                                                {
                                                                    $('#errorMessage').html(jqXHR.status + "CORONA API: Bad Request");
                                                                }
                                                                else if(jqXHR.status == '401')
                                                                {
                                                                    $('#errorMessage').html(jqXHR.status + "CORONA API: Unauthorised Request");
                                                                }
                                                                else if(jqXHR.status == '403')
                                                                {
                                                                    $('#errorMessage').html(jqXHR.status + "CORONA API: Request Forbidden"); 
                                                                }
                                                                else if(jqXHR.status == '404')
                                                                {
                                                                    $('#errorMessage').html(jqXHR.status + "CORONA API: Request Not Found"); 
                                                                }
                                                                else if(jqXHR.status == '500')
                                                                {
                                                                    $('#errorMessage').html(jqXHR.status + "CORONA API: Internal Server Error"); 
                                                                }
                                                                else if(jqXHR.status == '503')
                                                                {
                                                                    $('#errorMessage').html(jqXHR.status + "CORONA API: Service Unavailable");
                                                                }
                                                            }
                                                        });
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
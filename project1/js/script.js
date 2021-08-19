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
            let countryLatitude;
            let countryLongitude;
            let countryCurrency;

            $.ajax({
                url: "php/getRestCountry.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    countryCode: $('#countrySelect').val()
                },
        
                success: function(result){
                    console.log(JSON.stringify(result));

                    if(result.status.name == "OK")
                    {
                        countryLatitude = result['data']['latlng'][0];
                        countryLongitude = result['data']['latlng'][1];
                        countryCurrency = result['data']['currencies'][0]['code'];
                        
                    }
                    $('#errorMessage').html(countryCurrency);

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
                                $('#errorMessage').html(result['data'][4]['wikipediaUrl']);
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
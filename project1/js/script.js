$(window).on('load', function() {
    if($('#preloader').length) {
        $('#preloader').delay(500).fadeOut('slow', function() {
            $(this).remove();
        });
    }
    var mymap = L.map('mapid');
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

    $.ajax("php/getCountryCodes.php",
    {
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

    $.ajax("php/getCountryCodes.php",
    {
        dataType: 'json',
        
        success: function(result, status, xhr){
            console.log(JSON.stringify(result));

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
                let countryPolygons = result['data'][countryIndex]['geometry']['coordinates'];
                
                $('#errorMessage').html("Index of country" + countryPolygons[0]);
            }
        }
    })
})
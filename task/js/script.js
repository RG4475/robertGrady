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
                $('#field1').html("Airport ICAO Code: " + result['data']['ICAO']);
                $('#field2').html("Station Name: " + result['data']['stationName']);
                $('#field3').html("Temperature: " + result['data']['temperature']);
                $('#field4').html("Humidity: " + result['data']['humidity']);
                $('#field5').html("Clouds: " + result['data']['clouds']);
                $('#field6').html("Wind Speed: " + result['data']['windSpeed']);
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            
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
                $('#field1').html("Datetime: " + result['data'][0]['datetime']);
                $('#field2').html("Depth: " + result['data'][0]['depth']);
                $('#field3').html("Lng: " + result['data'][0]['lng']);
                $('#field4').html("Magnitude: " + result['data'][0]['magnitude']);
                $('#field5').html("");
                $('#field6').html("");
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {

        }
    });
});

/*
$(window).on('load', function() {
    if($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function() {
            $(this).remove();
        });
    }
});
$(document).ready(function(){

});
*/

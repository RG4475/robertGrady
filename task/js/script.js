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
                $('#field1').html(result['data']['ICAO']);
                $('#field2').html(result['data']['stationName']);
                $('#field3').html(result['data']['temperature']);
                $('#field4').html(result['data']['humidity']);
                $('#field5').html(result['data']['clouds']);
                $('#field6').html(result['data']['windSpeed']);
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
                $('#field1').html(result['data']['datetime']);
                $('#field2').html(result['data']['depth']);
                $('#field3').html(result['data']['lng']);
                $('#field4').html(result['data']['magnitude']);
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

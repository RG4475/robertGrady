$(window).on('load', function() {
    if($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function() {
            $(this).remove();
        });
    }
});
/*$(document).ready(function(){

});*/

$('#buttonAPI1').click(function() {
    $.ajax({
        url: "php/getWeatherICAO.php",
        type: 'POST',
        dataType: 'json',
        data: {
            icao: $("#icao").val()
        },
        success: function(result){

            console.log(JSON.stringify(result));

            if(result.status.name == "OK")
            {
                $('#weatherICAO').html(result['data'][0]['ICAO']);
                $('weatherICAO').html(result['data'][0]['stationName']);
                $('weatherICAO').html(result['data'][0]['temperature']);
                $('weatherICAO').html(result['data'][0]['humidity']);
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            
        }
    });
});
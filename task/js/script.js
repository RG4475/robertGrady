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

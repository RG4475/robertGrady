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
        $('#currentLocMessage').html("Unfortunately your web browser does not support Geolocation");
    }

    $.ajax("php/getCountryCodes.php",
    {
        dataType: 'json',

        success: function(result, status, xhr){
            console.log(JSON.stringify(result));

            if(result.status.name == "OK")
            {
                $('#currentLocMessage').html(result['data']['properties']['name']);
            }
        }
    });


});

$('#countrySelect').on('load', function() {


})
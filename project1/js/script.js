$(window).on('load', function() {
    if($('#preloader').length) {
        $('#preloader').delay(500).fadeOut('slow', function() {
            $(this).remove();
        });
    }
    var mymap = L.map('mapid').setView([51.505, -0.09], 13);

    var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    var marker = L.marker([51.5, -0.09]).addTo(mymap);

    var circle = L.circle([51.508, -0.11], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(mymap);

    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]).addTo(mymap);

    marker.bindPopup("Hello this is a marker").openPopup();
    circle.bindPopup("Hello this is a circle");
    polygon.bindPopup("Hello this is a polygon");

    var popup1 = L.popup()
        .setLatLng([51.5, -0.09])
        .setContent("This is a standalone popup.")
        .openOn(mymap);

    function onMapClick1(e) {
        alert("You clicked the map at these coordinates" + e.latlng);
    }

    //mymap.on('click', onMapClick1);

    var popup2 = L.popup();

    function onMapClick2(e) {
        popup2
            .setLatLng(e.latlng)
            .setContent("You clicked the map at these coordinates " + e.latlng.toString())
            .openOn(mymap);
    }

    mymap.on('click', onMapClick2);
});

$('#locationInfo').click(function() {

    function showPositionInfo(position) {
        $('#locationInfo').html("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
    }
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPositionInfo);
    }
    else {
        $('#locationInfo').html("Geolocation not supported");
    }
})
var map;
var markers = [];

//Loading Map
function init() {
    var MapSettings = {
        zoom: 12,
        center: { lat:42.353350,lng:-71.091525},
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    var element = document.getElementById('map');
    map = new google.maps.Map(element, MapSettings);
    addMarkers();
}

//Add bus markers to map
async function addMarkers() {
    //Bus Data
    var location = await BusLocations();

    //Loop through data, add bus markers
    locations.forEach(function(bus) {
        var marker = getMarker(bus.id);
        if (marker) {
            moveMarker(marker, bus);
        }
        else {
            addMarkers(bus);
        }
    });

    //timer
    console.log( new Date());
    setTimeout(addMarkers, 15000);
}

//Requesting data from MBTA
async function BusLocations() {
    var url = 'https://api.v3.mbta.com/vehicles?filter[route]=1&include=trip';
    var response = await fetch(url);
    var json = await response.json();
    return json.data;
}

function addMarker(bus) {
    var icon = getIcon(bus);
    var marker = new google.maps.Marker({
        position: {
            lat: bus.attributes.latitude,
            lng: bus.attributes.longitude
        },
        mao: map,
        icon: icon,
        id: bus.id
    });
    markers.push(marker);
}

function getIcon(bus) {
    //select icon based on map route
    if (bus.attributes.direction_id === 0) {
        return 'Pin.png';
    }
    return 'Rainbow.png';
}

function moveMarker(marker,bus) {
    //change icon when map route is finished
    var icon = getIcon(bus);
    marker.setIcon(icon);

    //move icon to new location
    marker.setPosition( {
        lat: bus.attributes.latitude,
        lng: bus.attributes.longitude
        });
}

function getMarker(id) {
    var marker = markers.find(function(item) {
        return item.id === id;
        });
        return marker;
}

window.onload = init;
var map = L.map('mapid').setView([51.505, -0.09], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// L.marker([51.5, -0.09]).addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();

var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-115, 55]]
}];

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

// L.geoJSON(myLines, {
//     style: myStyle
// }).addTo(map);

var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

// L.geoJSON(states, {
//     style: function(feature) {
//         switch (feature.properties.party) {
//             case 'Republican': return {color: "#ff0000"};
//             case 'Democrat':   return {color: "#0000ff"};
//         }
//     }
// }).addTo(map);

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

L.geoJSON(myLines, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map);

// var circle = L.circle([51.505, -0.09], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 500
// }).addTo(map);
var layerGroup = L.layerGroup().addTo(map);
var marray = [];
var popup = L.popup();
map.on('click',function(e){
    var population = e.latlng;
    var marker = L.marker([e.latlng.lat,e.latlng.lng]).addTo(map);
    marker.addTo(layerGroup);
    var corr = [marker.getLatLng().lat,marker.getLatLng().lng];
    marray.push(corr);
    drawline(marray)
   
    // popup
    //     .setLatLng(e.latlng)
    //     .setContent("You clicked the map at " + e.latlng.toString())
    //     .openOn(map);
});

function drawline(marray){
    var polyline = L.polyline(marray,{color:'yellow'}).addTo(map);
    polyline.addTo(layerGroup);
}

// var polygon = L.polygon([
//     [40.743, -73.822],
//     [39.760979, -84.192200],
//     [54.464180, -110.182259]
// ]).addTo(map);
// var latlngs = [
//     [40.743, -73.822],
//     [39.760979, -84.192200],
//     [54.464180, -110.182259]
// ]

// var polyline = L.polyline(latlngs,{color:'yellow'}).addTo(map);

function testFunction1(){
    layerGroup.clearLayers();
    map.closePopup();
    marker = L.marker([40.743, -73.822]).addTo(layerGroup);
    marker.bindPopup('spiderman').openPopup();
}

function testFunction2(){
    layerGroup.clearLayers();
    map.closePopup();
    marker = L.marker([39.760979, -84.192200]).addTo(layerGroup);
    marker.bindPopup('spiderman').openPopup();
}


function testFunction3(){
    layerGroup.clearLayers();
    map.closePopup();
    marker = L.marker([54.464180, -110.182259]).addTo(layerGroup);
    marker.bindPopup('spiderman').openPopup();
}
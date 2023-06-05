
// // var coastlines = {"type":"FeatureCollection","feature":"Coastline"}
// import { coastlines } from './ne_50m_coastline.geojson.js'
// import { countries } from './ne_10m_admin_0_countries.geojson.js'
// import { populatedPlaces } from './ne_110m_populated_places_simple.geojson.js'




// var map = L.map('map').setView([51.505, -0.09], 3);
// // L.geoJSON(coastlines).addTo(map);
// // L.geoJSON(populatedPlaces).addTo(map);
// // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
// L.geoJSON(countries).addTo(map);


// map.setMaxBounds(bounds);
// map.on('drag', function () {
//     map.panInsideBounds(bounds, { animate: false });
// });







var map = L.map('map').setView([0.0, 180], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// var southWest = L.latLng(-89.98155760646617, -180),
//     northEast = L.latLng(89.99346179538875, 180);
// var bounds = L.latLngBounds(southWest, northEast);
// var bounds = L.latBounds(northEast)
// var marker = L.marker([51.5, -0.09]).addTo(map);

// var circle = L.circle([51.508, -0.11], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 500
// }).addTo(map);

// var polygon = L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
// ]).addTo(map);

var line = L.polyline([
    [0, 100],
    [10, 120],
    [20, 140]
]).addTo(map);



// import data from './tracks.json' assert { type: 'json' };
// console.log(data);

// readJson() {
//     // http://localhost:8080
//     fetch('/tracks.json')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("HTTP error " + response.status);
//             }
//             return response.json();
//         })
//         .then(json => {
//             this.users = json;
//             //console.log(this.users);
//         })
//         .catch(function () {
//             this.dataError = true;
//         })
// }








// marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// circle.bindPopup("I am a circle.");
// polygon.bindPopup("I am a polygon.");

// // var popup = L.popup()
// //     .setLatLng([51.513, -0.09])
// //     .setContent("I am a standalone popup.")
// //     .openOn(map);

// // function onMapClick(e) {
// //     alert("You clicked the map at " + e.latlng);
// // }

// // map.on('click', onMapClick);

// var popup = L.popup();

// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(map);
// }

// map.on('click', onMapClick);
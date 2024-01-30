// create the tile layers for the backgrounds of the map
var defaultMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// grayscale layer
var grayscale = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

var terrainMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

// make basemaps object
let basemaps = {
    Default: defaultMap,
    GrayScale: grayscale,
    TerrainMap: terrainMap
}

// make a map object
var myMap = L.map("map", {
    center:[36.7783, -119.4179],
    zoom: 3,
    layers: [defaultMap, grayscale, terrainMap]
});

// add the default map to the map
defaultMap.addTo(myMap);

// get the data for the tectonic plates and draw on the map
// variable to hold the tectonic plates layer
let tectonicPlates = new L.layerGroup();

// call the api to get the info for the tectonic plates

d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
.then(function(plateData){

    // load data using geoJson and add to the tectonic plates layer group
    L.geoJson(plateData,{
        // add styling to make the lines visable
        color: "yellow",
        weight: 1
    }).addTo(tectonicPlates);
})

// add the plates to the map
tectonicPlates.addTo(myMap);

// create info for earthquake data
let earthquakes = new L.layerGroup();

// get earthquake data and pop. the layerGroup
// make api call to get the geojson data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(
    function(earthquakeData){
        // plot circles, where radius is dependent on the magnitude
        // color dependent on the depth of the earthquake

        // make function that chooses the color of the data point
        function dataColor(depth){
            if (depth > 90)
                return "red";
            else if (depth > 70)
                return "#fc4903";
            else if (depth > 50)
                return "#fc8403";
            else if (depth > 30)
                return "#fcad03";
            else if (depth > 10)
                return "#cafc03";
            else    
                return "green";
        }
        // make function to determine size of radius
        function radiusSize(mag){
            if (mag == 0)
                return 1;
            else 
                return mag * 5; 
        }
        // add style for each data point
        function dataStyle(feature){
            return{
                opacity: .5,
                fillOpacity: .5,
                fillColor:dataColor(feature.geometry.coordinates[2]), 
                color: "000",
                radius: radiusSize(feature.properties.mag),
                weight: 0.5,
                stroke: true
            }
        }
        // add the geojson data
        L.geoJson(earthquakeData,{
            // make each feature a marker that is on the map, each marker is a circle
            pointToLayer: function(feature, latLng){
                return L.circleMarker(latLng);
            },
            // set the style for each marker
            style: dataStyle, 
            // add pop-ups
            onEachFeature: function(feature, layer){
                layer.bindPopup(`Magnitude: <b>${feature.properties.mag}</b><br>
                                Depth: <b>${feature.geometry.coordinates[2]}</b><br>
                                Location: <b>${feature.properties.place}</b>`);
            }
        }).addTo(earthquakes);
    }
);

// add the earthquake layer
 earthquakes.addTo(myMap);

// add overlay for the plates and for earthquakes
let overlays = {
    "Tectonic Plates": tectonicPlates,
    "Earthquake Data": earthquakes
};

// add layer control
L.control
    .layers(basemaps, overlays)
    .addTo(myMap);


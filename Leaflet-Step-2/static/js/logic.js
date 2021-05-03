//Link used to grab the monthly earthquake data from usgs.
var usgs_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

//Creating a function to set the size of marker
    function markerSize(magnitude){
        return magnitude * 5;
    };

//Variable to hold the layers into a group
    var group = new L.LayerGroup();

//Using promise with the usage of 'then' method to extract data
    d3.json(usgs_url).then(function(data){
        L.geoJSON(data.features, {
            // convert point feature to map layer 
            pointToLayer: function(feature, latlng){
                return L.circleMarker(latlng, {
                    radius: markerSize(feature.properties.mag)
                });
            },
            style: function(dataFeature){
                return {
                    fillColor: color(dataFeature.properties.mag),
                    fillOpacity: 0.5,
                    weight: 0.1,
                    color: 'black'
                }
            },

            onEachFeature: function(feature, layer){
                layer.bindPopup('<h3>' + feature.properties.place + '<h3><hr><p>' +
                new Date(feature.properties.time) + '</p>');
            }

        }).addTo(group);
        dataMap(group); 
    });

//Link to get the data on tectonic plates
var tect_plate = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

//Creating a new layer for the boundary
var boundary = new L.LayerGroup();

//Using promise with the usage of 'then' method to extract data
d3.json(tect_plate).then(function(data){
    //console.log(data)
    L.geoJSON(data.features, {
        style: function (geoJsonFeature){
            return{
                weight: 3,
                color: 'orange'
            }
        },
    }).addTo(boundary);
})

//Creating function for color scale based on magnitude
function color(magnitude){
    if (magnitude > 5){
        return 'red'
    } else if (magnitude > 4){
        return 'orange'
    } else if (magnitude > 3){
        return 'yellow'
    } else if (magnitude > 2){
        return 'green'
    } else if (magnitude > 1){
        return 'lightblue'
    } else {
        return 'purple'
    }
};

//Creating the function for map with base and other layers
function dataMap(){
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });

    var baseMaps = {
        'Street Map': streetmap,
        'Light Map': lightmap,
        'Satellite': satellite
    };

    var overlayMaps = {
        "Earthquakes": group,
        'Fault Line': boundary
    };

    var myMap = L.map('mapid', {
        center: [15.5994, -28.6731],
        zoom: 4,
        layers: [streetmap, group, lightmap, satellite, boundary]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

//Setting up the legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(myMap){
        var div = L.DomUtil.create("div", "info legend"),
         magnitude = [0, 1, 2, 3, 4, 5];
         colors = [];
//Adding the range for colors and magnitude
    div.innerHTML += "<h4 style='margin:4px'>Range</h4>"

    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML += "<i style='background: " + color(magnitude[i] +1) + "'></i> " +
          magnitude[i] + ( magnitude[i + 1] ? "&ndash;" + magnitude[i + 1] + "<br>" : "+");
      }
      return div;
    };

//Adding legend to the map    
    legend.addTo(myMap); 
}

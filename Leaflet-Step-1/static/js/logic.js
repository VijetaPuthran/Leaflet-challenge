// Creating a map object
var myMap = L.map("mapid", {
    center: [15.5994, -28.6731],
    zoom: 4
  });

// Creating the tile layer that will be the background of our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

//Link used to grab the monthly earthquake data from usgs.
usgs_url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
//Adding a new layer to show the earthquakes in terms of magnitude.
var earthquakes = new L.LayerGroup();

//Using promise with the usage of 'then' method to extract data
d3.json(usgs_url).then(function(data){
    //console.log(data)
    
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
  }
//Creating function for radius of the circle based on the magnitude
  function radius(magnitude){
      return magnitude * 5;
    }
//Creating function for style info
  function style(feature){
      return{
          opacity: 1,
          fillOpacity: 0.5,
          fillColor: color(feature.properties.mag),
          color: "black",
          weight: 0.1,
          stroke: true
          
      };
  }
// Adding GeoJSON layer to the map
    L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng,{
          radius: radius(feature.properties.mag)
      });
    },
    style: style,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  }).addTo(earthquakes);
//Adding the earthquake layer to the map
earthquakes.addTo(myMap);

//Setting up the legend
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
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

});


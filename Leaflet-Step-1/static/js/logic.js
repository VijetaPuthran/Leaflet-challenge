// Create a map object
var myMap = L.map("mapid", {
    center: [15.5994, -28.6731],
    zoom: 3
  });

  // Create the tile layer that will be the background of our map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

usgs_url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
var earthquakes = new L.LayerGroup();


d3.json(usgs_url).then(function(data){
    //Create function for color scale based on magnitude
  function color(magnitude){
    // console.log(magnitude)
    if (magnitude > 5){
        return 'red'
    } else if (magnitude > 4){
        return 'orange'
    } else if (magnitude > 3){
        return 'yellow'
    } else if (magnitude > 2){
        return 'green'
    } else if (magnitude > 1){
        return 'blue'
    } else {
        return 'purple'
    }
  }
    //Create function for radius of the circle based on the magnitude
  function radius(magnitude){
      return magnitude * 5;
    }
    //Create function for style info
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
      // add GeoJSON layer to the map
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

  earthquakes.addTo(myMap);


});


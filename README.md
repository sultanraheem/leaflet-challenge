# leaflet-challenge

# Instructions

Part 1: Create the Earthquake Visualization
2-BasicMap
Your first task is to visualize an earthquake dataset. Complete the following steps:

Get your dataset. To do so, follow these steps:

The USGS provides earthquake data in a number of different formats, updated every 5 minutes. Visit the USGS GeoJSON FeedLinks to an external site. page and choose a dataset to visualize. The following image is an example screenshot of what appears when you visit this link:
3-Data
When you click a dataset (such as "All Earthquakes from the Past 7 Days"), you will be given a JSON representation of that data. Use the URL of this JSON to pull in the data for the visualization. The following image is a sampling of earthquake data in JSON format:
4-JSON
Import and visualize the data by doing the following:

Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.

Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.

Hint: The depth of the earth can be found as the third coordinate for each earthquake.

Include popups that provide additional information about the earthquake when its associated marker is clicked.

Create a legend that will provide context for your map data.

Your visualization should look something like the preceding map.

# css and js files

style.css:
/* Reset default margin and padding for body */
body {
  padding: 0;
  margin: 0;
}

/* Set map, body, and html to 100% height */
#map,
body,
html {
  height: 100%;
}

/* Styles for legend */
.legend {
  line-height: 22px;
  color: black;
  text-align: right;
  background-color: snow;
}

.legend i {
  width: 35px;
  height: 20px;
  float: right;
  margin-left: 8px;
  opacity: 0.8;
}

logis.js
// URL to the earthquake data (replace with your chosen dataset URL)
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(url)
  .then(function(data) {
    createFeatures(data.features);
  })
  .catch(function(error) {
    console.log("Error fetching earthquake data:", error);
  });

// Function to create features (markers and popups) on the map
function createFeatures(earthquakeData) {
  
  // Function to create circle markers based on earthquake magnitude
  function createCircleMarker(feature, latlng) {
    let options = {
      radius: feature.properties.mag * 5,  // Adjust multiplier for better visualization
      fillColor: chooseColor(feature.properties.mag),
      color: chooseColor(feature.properties.mag),
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.35
    };
    return L.circleMarker(latlng, options);
  }

  // Function to bind popups to each feature
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p>`);
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: createCircleMarker,
    onEachFeature: onEachFeature
  });

  // Send earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Function to determine color based on earthquake magnitude
function chooseColor(magnitude) {
  switch(true) {
    case (magnitude < 1):
      return "#ccff33"; // Light yellow
    case (magnitude < 2):
      return "#ffff33"; // Yellow
    case (magnitude < 3):
      return "#ffcc33"; // Orange
    case (magnitude < 4):
      return "#ff9933"; // Dark orange
    case (magnitude < 5):
      return "#ff6633"; // Orange-red
    default:
      return "#ff3333"; // Red
  }
}

// Function to create the map
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Define a baseMaps object to hold base layers
  let baseMaps = {
    "Street Map": streetmap
  };

  // Define an overlayMaps object to hold overlay layers
  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map, centering it at a specific geographical coordinate and zoom level
  let myMap = L.map("map", {
    center: [37.09, -95.71], // Centered roughly over the United States
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control, adding baseMaps and overlayMaps to it
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  // Create a legend control and add it to the map
  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend'),
        magnitudes = [0, 1, 2, 3, 4, 5];

    // Loop through magnitude intervals and generate a label with a colored square for each interval
    for (let i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
          '<i style="background:' + chooseColor(magnitudes[i]) + '"></i> ' +
          magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}

# Complete Work Cited

https://doc.arcgis.com/en/arcgis-online/reference/geojson.htm#:~:text=GeoJSON%20is%20an%20open%20standard,variety%20of%20geographic%20data%20structures.
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
https://stackoverflow.com/questions/25364072/how-to-use-circle-markers-with-leaflet-tilelayer-geojson
https://chatgpt.com/share/e6f8f114-959f-42e7-98fe-7e865437596d
https://earthquake.usgs.gov/fdsnws/event/1/
https://www.w3schools.com/js/js_errors.asp
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch





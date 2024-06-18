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

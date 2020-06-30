var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create map object

var myMap = L.map("map", {
    center: [
      36.61, -119.52
    ],
    zoom: 6,
});

// Add tilelayer

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Â© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> Â© <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

//   Access the geojason

d3.json(url, function(data) {
    createFeatures(data.features);
    console.log(data.features);
    //data.features.forEach(d => console.log(d.geometry.coordinates[1],d.geometry.coordinates[0]))
});

function colorMag(magnitude) {
  var fillColor = "";
  switch(true) {
    case(magnitude >= 0 && magnitude < 1):
        fillColor = "#ffffb2";
        // console.log(fillColor);
        return fillColor;
    case(magnitude >= 1 && magnitude < 2):
        fillColor = "#fed976";
        // console.log(fillColor);
        return fillColor;
    case(magnitude >= 2 && magnitude < 3):
        fillColor = "#feb24c";
        // console.log(fillColor);
        return fillColor;
    case(magnitude >= 3 && magnitude < 4):
        fillColor = "#fd8d3c";
        // console.log(fillColor);
        return fillColor;
    case(magnitude >= 4 && magnitude < 5):
        fillColor = "#f03b20";
        // console.log(fillColor);
        return fillColor;
    case(magnitude >= 5):
      fillColor = "#bd0026";
      // console.log(fillColor);
      return fillColor;
}
}


function createFeatures(earthquakeData) {


    function onEachFeature(feature, layer) {
        //console.log(feature.properties.mag)
        L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
            color: colorMag(feature.properties.mag),
            fillColor: colorMag(feature.properties.mag),
            fillOpacity: 0.75,        // How transparent you want the marker; 1 is solid (opaque)
            radius: feature.properties.mag*10000             // The size of the circle
          }).bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
          .addTo(myMap);


    }
    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: onEachFeature
    });
    // add earthquake layer to map
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    // insert the magnitudes below
        mag = [0,1,2,3,4,5]

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mag.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorMag(mag[i]) + '"></i> ' +
            mag[i] + (mag[i + 1] ? '&ndash;' + mag[i +1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);




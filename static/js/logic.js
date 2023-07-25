// Store API endpint as queryUrl
let Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Create our map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 10,
});
    
// Create tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json(Url).then(function(data) {
    function mapStyle(feature) {
        return {
            radius: createFeatures(feature.properties.mag),
            fillColor:mapColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.7,
            color: "black",
            stroke: true,
            weight: 0.5
        };
    }
    
    function mapColor(depth) {
        if (depth < 10) return "#00FF00";
        else if (depth < 30) return "greenyellow";
        else if (depth < 50) return "yellow";
        else if (depth < 70) return "orange";
        else if (depth < 90) return "orangered";
        else return "#FF0000";
    }

    // Define function of magnitude
        function createFeatures(magnitude) {
        return magnitude * 4;
    };

    // Add Data
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: mapStyle,

        // Activate pop-up data
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);

// Add depth legend
let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];
  
    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
  
    for (let i = 0; i < depth.length; i++) {
        div.innerHTML +=
        '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap)
});
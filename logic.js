var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function(data) {
	createFeatures(data.features);
});

function markerSize(magnitude) {
	return magnitude * 25000;
};


function createFeatures(earthquakeData) {

	var earthquakes = L.geoJSON(earthquakeData, {
    	onEachFeature: function (feature, layer) {
    		layer.bindPopup("<h3>" + feature.properties.place + 
    		"</h3><hr><p> Magnitude: " + feature.properties.mag + 
    		"<br>" + new Date(feature.properties.time) + "</p>");
		},
		pointToLayer: function(feature, latlng){
			return L.circle(latlng,
				{radius: markerSize(feature.properties.mag),
					color: "black",
					fillColor: markerColor(feature.properties.mag),
					fillOpacity: 0.75,
					stroke: true,
					weight: 1
			})
		}
  	});

	createMap(earthquakes);
};


function markerColor(magnitude) {
	if (magnitude > 5) {
		return "darkred"
	} else if (magnitude > 4) {
		return "red"
	} else if (magnitude > 3) {
		return "orange"
	} else if (magnitude > 2) {
		return "yellow"
	} else if (magnitude > 1) {
		return "green"
	} else {
		return "lightgreen"
	}
};

function createMap(earthquakes) {

	var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    	maxZoom: 18,
    	id: "mapbox.light",
    	accessToken: API_KEY
  	});

	var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    	maxZoom: 18,
    	id: "mapbox.satellite",
    	accessToken: API_KEY
  	});

	var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    	maxZoom: 18,
    	id: "mapbox.outdoors",
    	accessToken: API_KEY
  	});

	var baseMaps = {
    	Grayscale: light,
    	Satellite: satellite,
    	Outdoors: outdoors
  	};

	var overlayMaps = {
    	Earthquakes: earthquakes
  	};

	var myMap = L.map("map", {
    	center: [40, -105],
		zoom: 4.5,
    	layers: [light, earthquakes]
	});

	L.control.layers(baseMaps, overlayMaps, {
    	collapsed: false
    }).addTo(myMap);

	var legend = L.control({ position: "bottomright" });
	legend.onAdd = function(map) {
		var div = L.DomUtil.create("div", "info legend"),
    		magnitude = [0, 1, 2, 3, 4, 5],
    		labels = [];

    	for (var i = 0; i < magnitude.length; i++) {
        	div.innerHTML +=
        		'<i style="background:' + markerColor(magnitude[i] + 1) + '"></i> ' +
            	magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    	}

    	return div;
	};

	legend.addTo(myMap);
}
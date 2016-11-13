"use strict";



//Get started: http://leafletjs.com/examples/quick-start/
//Need to match something like: http://leafletjs.com/examples/choropleth/
//TODO: create a geoJSON layer with the data from Fisher
// Parse local CSV file to JSON
Papa.parse('data/Per-Capita-Cities.csv', {
  download: true,
	complete: function(results) {
		//console.log("Finished:", results.data);
    var places = results.data;

    function getCityData(city) {
      var latLongJson = {
          locations : []
      };
      $.get( 'http://maps.googleapis.com/maps/api/geocode/json?address='+ encodeURI(city), function(data ) {
        //console.log( data.results[0].geometry.location.lat );
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        latLongJson.locations.push(lat,lng);

      });
      return latLongJson;
    }

    var i = 0;
    var id = window.setInterval(function(){
        if(i >= places.length) {
            clearInterval(id);
            return;
        }
        var city = places[i][1];
        var place = getCityData(city);
        places[i].push(place.locations);
        i++;
    }, 200);


    console.log(places);


	}
});

var mymap = L.map('mapid').setView([51.505, -0.09], 13);

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     maxZoom: 18,
//     id: 'your.mapbox.project.id',
//     accessToken: 'your.mapbox.public.access.token'
// }).addTo(mymap);

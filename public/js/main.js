"use strict";
//retreive data from object loaded
var placesData = data;

var parseData = function() {

    return {
      getLatitudeandLongitude: function() {
        function getCityData(city) {
            var latLongJson = {
                locations: []
            };
            $.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURI(city), function(data) {
                var lat = data.results[0].geometry.location.lat;
                var lng = data.results[0].geometry.location.lng;
                latLongJson.locations.push(lat, lng);
            });
            return latLongJson;
        }

        var i = 0;
        var id = window.setInterval(function() {
            if (i >= placesData.length) {
                clearInterval(id);
                return;
            }
            var city = places[i][1];
            var place = getCityData(city);
            placesData[i].push(place.locations);
            i++;
        }, 200);
      },
      mapMarkersInit: function() {
        // Define an icon called cssIcon
        var cssIcon = L.divIcon({
          // Specify a class name we can refer to in CSS.
          className: 'css-icon',
          // Set marker width and height
          iconAnchor:   [5, 5],
          iconSize: [10, 10]

        });
        // var greenIcon = L.icon({
        //     iconUrl: 'http://maps.google.com/mapfiles/marker_green.png',
        //     shadowUrl: 'http://googlemaps.googlermania.com/img/marker_shadow.png',
        //
        //     iconSize:     [20, 34], // size of the icon
        //     shadowSize:   [50, 64], // size of the shadow
        //     iconAnchor:   [10, 34], // point of the icon which will correspond to marker's location
        //     shadowAnchor: [4, 62],  // the same for the shadow
        //     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        // });
        //console.log(placesData);
        placesData.forEach(function(place) {
          L.marker([place.Latitude,place.Longitude], {icon: cssIcon}).addTo(mymap)
          .bindPopup('<div class="active-place" data-active="'+place.City+'">City: '+place.State+'<br>Population: '+place.Population.toLocaleString()+'<br># of Plans: '+place.Sum+'<br>401(k) Plans per person: '+Math.round(place.PerCapita)+'</div>');
        });

      },
      selectCitiesInit: function() {
        //use map function to get city, state values
        // var cityData = placesData.map(function(place) {
        //   var newdata = {};
        //   newdata.id = place.City;
        //   newdata.city = place.State;
        //   return newdata;
        // });
        function dataToHtml(place) {
          return '<option name="selectCountry" data-active="'+place.City+'" value="'+place.State+'">'+place.State+'</option>';
        }



        var cityHtml = placesData
          .map(dataToHtml)
          .join('');

        console.log(cityHtml);

        // var html;
        // cityData.forEach(function(place) {
        //   html += '<option name="selectCountry" data-active="" value="'+place+'">'+place+'</option>';
        // });
        //jQuery('#input-city').append(html);

        // var options;
        // //use map function to create this data.
        // //Look at MDN site
        // for (var i = 0; i < placesData.length; i++) {
        //   options += '<option name="selectCountry" data-active="'+placesData[i].City+'" value="'+placesData[i].State+'">'+placesData[i].State+'</option>';
        // }
        jQuery('#input-city').append(cityHtml);
      },
      selectChange: function() {
        var city = jQuery(this).val();


        //Prefered method to use with data objects. Finds the match and exits the dataset.
        var place = placesData.find(function(item) {
          return (item.State == city);
        });

        if (!place) {
          jQuery('#place-data').html('error!  city not found');
          return;
        }

        var cityData = '<div class="active-place" data-active="'+place.City+'"><h1> '+place.State+'</h1><br><h3>Population: '+place.Population.toLocaleString()+'</h3><br><h3># of Plans: '+place.Sum+'</h3><br><h3>401(k) Plans per person: '+Math.round(place.PerCapita)+'</h3></div>';
        jQuery('#place-data').html(cityData);


        //JavaScript forEach with data. This finds match but still goes through entire dataset.
        // placesData.forEach(function(place) {
        //   if (place.State == city) {
        //     var cityData = '<div class="active-place" data-active="'+place.City+'"><h1> '+place.State+'</h1><br><h3>Population: '+place.Population.toLocaleString()+'</h3><br><h3># of Plans: '+place.Sum+'</h3><br><h3>401(k) Plans per person: '+Math.round(place.PerCapita)+'</h3></div>';
        //     jQuery('#place-data').html(cityData);
        //   }
        // });

        //using for loop with data. Old school method
        // for (var i = 0; i < placesData.length; i++) {
        //   if (placesData[i].State == city) {
        //     //L.marker([placesData[i].Latitude,placesData[i].Longitude]).openPopup();
        //   var cityData = '<div class="active-place" data-active="'+placesData[i].City+'"><h1> '+placesData[i].State+'</h1><br><h3>Population: '+placesData[i].Population.toLocaleString()+'</h3><br><h3># of Plans: '+placesData[i].Sum+'</h3><br><h3>401(k) Plans per person: '+Math.round(placesData[i].PerCapita)+'</h3></div>';
        //   jQuery('#place-data').html(cityData);
        //
        //   }
        // }
      }
    }
};

//https://api.mapbox.com/styles/v1/theedoubled/civ6s2xjt001t2ipba9bb1f24.html?title=true&access_token=pk.eyJ1IjoidGhlZWRvdWJsZWQiLCJhIjoiY2l2NnJ3NndzMDAycjJ0cGl4bjJ2aHpoMCJ9.129D3vdFfW03UkZv4F8OMg#3.7/36.22159401247177/-99.42065073185901/0
var mymap = L.map("mapid").setView([ 36.22159401247177, -99.42065073185901 ], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/theedoubled/civ8gbbex00032iqrwvmaq2oy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlZWRvdWJsZWQiLCJhIjoiY2l2NnJ3NndzMDAycjJ0cGl4bjJ2aHpoMCJ9.129D3vdFfW03UkZv4F8OMg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox://styles/theedoubled/civ8gbbex00032iqrwvmaq2oy',
    accessToken: 'pk.eyJ1IjoidGhlZWRvdWJsZWQiLCJhIjoiY2l2NnJ3NndzMDAycjJ0cGl4bjJ2aHpoMCJ9.129D3vdFfW03UkZv4F8OMg'
}).addTo(mymap);


jQuery(window).load(function() {
  var map = parseData();
  //init markers
  map.mapMarkersInit();
  //init select options
  map.selectCitiesInit();
  //autocomplete functionality
  jQuery('select').selectToAutocomplete();
  //Select autocomplete change
  jQuery('.autoCompleteMe').on('change', map.selectChange);

  jQuery('form').submit(map.selectChange);

});

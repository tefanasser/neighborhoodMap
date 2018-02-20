// Data for 5 universities 
var list = [{
        index: 0,
        name: "Princess Norah University",
        lat: 24.8464662,
        lng: 46.7225421,
        show: ko.observable(true)
    },
    {
        index: 1,
        name: "Immam University",
        lat: 24.8159457,
        lng: 46.6871576,
        show: ko.observable(true)
    },
    {
        index: 2,
        name: "King Saud University",
        lat: 24.7162459,
        lng: 46.6169191,
        show: ko.observable(true)
    },
    {
        index: 3,
        name: "Prince Sultan University",
        lat: 24.7347468,
        lng: 46.6953868,
        show: ko.observable(true)
    },
    {
        index: 4,
        name: "Al-Faisal University",
        lat: 24.6643064,
        lng: 46.6737777,
        show: ko.observable(true)
    }

];
// global varibles 
var map;
var markers = [];
var bounds;

//viewmodel
//live search functionality based on https://gist.github.com/hinchley/5973926
var viewModel = {
    //input query to filter
    query: ko.observable(''),
    //uni name clicked from list
    clicked: function(value) {
        markerclick(markers[value.index]);
    },
    //observable array to show and filter uni list
    filterList: ko.observableArray([]),
    // serach and filter function 
    search: function(value) {
//initally hide all names and markers
        for (var x in list) {
            viewModel.filterList()[x].show(false);
            markers[x].visible = false;
            markers[x].setMap(null);
        }
//if the search query is empty show all names and markers
        if (value == '') {
            for (var i in list) {
                viewModel.filterList()[i].show(true);
                markers[i].visible = true;
                markers[i].setMap(map);

            }
            return;
        }
        // show list and markers based on the query 
        for (var i in list) {
            if (list[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {

                viewModel.filterList()[i].show(true);
                markers[i].visible = true;
                markers[i].setMap(map);

            }
        }
    },
};
// fill observable array with all unis
for (var i in list) {
    viewModel.filterList.push(list[i]);
}
// binding
viewModel.query.subscribe(viewModel.search);
ko.applyBindings(viewModel);



// init map function
function initMap() {
    // intialize new map on riyadh
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {
            lat: 24.7241504,
            lng: 46.7152476
        }
    });
    // intialize map bounds
    bounds = new google.maps.LatLngBounds();
    // add all markers to map
    for (var i in list) {
        var marker = new google.maps.Marker({
            position: {
                lat: list[i].lat,
                lng: list[i].lng
            },
            map: map,
            title: list[i].name,
            id: i
        });
        bounds.extend(marker.position);
        map.fitBounds(bounds);
        markers.push(marker);
        marker.addListener('click', function() {
            markerclick(this);
        });
    }
};
// onerror function for maps  
function mapError() {
    alert('Google map error');
}

//when the marker is clicked bounce and show info window
function markerclick(marker) {
    var largeInfoWindow = new google.maps.InfoWindow();

    populateInfowindow(marker, largeInfoWindow);

}

function toggleBounce(marker) {
    if (marker.getAnimation()) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function populateInfowindow(marker, infoWindow) {
    toggleBounce(marker);
 // wikipedia api 
    var searchTerm = marker.title;
    var url = "https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=" + searchTerm + "&limit=1&namespace=0&format=json";
    var info;

    $.ajax({
        url: url,
        dataType: 'json',
        success: function(data) {
            info = data[3][0];
            if (infoWindow.marker != marker) {
                infoWindow.marker = marker;
                infoWindow.setContent('<div><a href=' + info + '>' + searchTerm + '</a></div>');
                infoWindow.open(map, marker);
                infoWindow.addListener('closeclick', function() {
                    //marker.setMarker(null);
                    infoWindow.close();
                });


            }
        },
        error: function() {
            alert('API ERROR');
        }
    });

}
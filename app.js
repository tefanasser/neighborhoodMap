var list=[
        {name:"Princess Norah University",
     lat:24.8464662,
    lng:46.7225421,
    show:true},
    {name:"Immam University",
    lat:24.8159457,
    lng:46.6871576,
    show:true},
   {name:"King Saud University",
   lat:24.7162459,
    lng:46.6169191,
    show:true
   },
    {name:"Prince Sultan University",
    lat:24.7347468,
    lng:46.6953868,
     show:true
   },
   {name:"Al-Faisal University",lat:24.6643064, lng:46.6737777,show:true}
   
];

var viewModel= {
    
uniList: ko.observableArray(list),
query:ko.observable(''),
search:function(value) {
    for (var i in list){
    viewModel.uniList()[i].show=ko.observable(false);
    }

    if (value == ''){
        for (var i in list){
    list[i].show=true;
    }
        return;
    }
      for (var i in list) {
      if (list[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        list[i].show=true;
      }
    }
  },
}

viewModel.query.subscribe(viewModel.search);
ko.applyBindings(viewModel);


var markers=[];

 function initMap() {
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: {lat: 24.7241504, lng: 46.7152476}
        });
        for (var i in list){
var marker= new google.maps.Marker({
   position:{lat:list[i].lat,
             lng:list[i].lng},
    map:map,
    title:list[i].name,
    id:i
});
markers.push(marker);
marker.addListener('click',function(){
    markerclick(this);
});
}
        }
        initMap();
   
function markerclick(marker){
            var largeInfoWindow= new google.maps.InfoWindow();
   
    populateInfowindow(marker,largeInfoWindow);
   
}
      function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
        
 function populateInfowindow(marker,infoWindow) {
 toggleBounce(marker);
     var searchTerm=marker.title;
     var url= "https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search="+searchTerm+"&limit=1&namespace=0&format=json";
     var info;
     
     $.ajax({
 url: url,
 dataType: 'json',
 success: function( data ){
        info=data[3][0];
     if (infoWindow.marker!=marker){
         infoWindow.marker=marker;
         infoWindow.setContent('<div><a href='+info+'>'+searchTerm+'</a></div>');
         infoWindow.open(map,marker);
         infoWindow.addListener('closeclick',function(){
             this.setMarker(null);
         });
     
    
 }
         },
 error: function() {
alert( 'API ERROR' );
 }
     });
      
          }

var map;
var markers = [];

const musical_places = [
    {
        name : 'Cairo Jazz Club',
        LatLong : 
        {
            lat : 30.062237 ,
            lng : 31.212256
        },
        address : '187, 26th of July street (Sphinx Sq. Agouza)',
        commentt : 'One of our favorite nightspots. Good music, no ridiculous minimum charge, no dressing                      like youre clubbing in Vegas. Great food as well if you go early enough before it gets                      crowded',
        describe : 'Jazz Club'
    },
    
     {
        name : 'Naguib Mahfouz Cafe',
        LatLong : 
        {
            lat : 30.048023 ,
            lng : 31.261643
        },
        address : 'Khan Al-Khalili • Al-Hussain',
        commentt : 'Amazing amazing restaurant mix between traditional history and luxury service, staff so                     friendly, food so delicious',
        describe : 'Café, Hookah Bar, and Music Venue'
    },
    
    {
        name : 'Bab El Nil',
        LatLong : 
        {
            lat : 30.071877 ,
            lng : 31.227714
        },
        address : 'Nile City Tower - 2005 B Corniche El Nil - Ramlet Beaulac',
        commentt : 'Lovely place great shisha yummy Egyptian food',
        describe : 'Café, Hotel Bar, and Hookah Bar'
    },
    
    {
        name : 'Moon Deck',
        LatLong : 
        {
            lat : 30.045860,
            lng : 31.228294
        },
        address : 'Blue Nile Boat - Saray El Gezira St (Corniche El Gezira),Zamalek',
        commentt : 'Amazing view of the Nile! And you gotta love the Lebanese food there!',
        describe : 'Lounge'
    },

    {
        name : 'Al Saraya',
        LatLong : 
        {
            lat : 30.050369,
            lng : 31.227998
        },
        address : 'El Gezira St.,Zamalek,Muḩāfaz̧at al Qāhirah',
        commentt : 'Good food, not a bad view, music needs improvement, service is great',
        describe : 'Seafood Restaurant, Café, and Hookah Bar'
    }
];

    ////Start the function of search //////////
    
    /**
   * Knockout ViewModel class
   */
  class ViewModel {
    constructor() {

      this.placesArray = ko.observableArray(musical_places);
      this.filterKeyword = ko.observable('');
      
      /**
       * Filter function, return filtered food by
       * matching with user's keyword
       */
      this.filterPlaces = ko.computed(() => {
        if (!this.filterKeyword()) {
          // No input found, return all food
          return this.placesArray();
        } else {
          // input found, match keyword to filter
          return ko.utils.arrayFilter(this.placesArray(), (places) => {
            return places.name.toLowerCase().indexOf(this.filterKeyword().toLowerCase()) !== -1;
          });
        } //.conditional
      }); //.filterFood 
    } //.constructor
      self.clickHandler = function (musical_places) {
        google.maps.event.trigger(musical_places.marker, 'click');
    };
  }; //.class
  
  // Start app
  self.ko.applyBindings(new ViewModel());
    
///// End the function of search /////////

function initmap(){
    map = new google.maps.Map(document.getElementById('map'),{
    center : {lat: 30.044420 , lng: 31.235712 },
    zoom : 13
    });

var i=0;
while(i < musical_places.length ){
    
    var position = musical_places[i].LatLong;
    var name = musical_places[i].name;
    var address = musical_places[i].address;
    var commentt = musical_places[i].commentt;
    var describe = musical_places[i].describe;
    
    var marker = new google.maps.Marker({        
        position : position,
        name : name,
        map : map,
        address : address,
        commentt : commentt,
        describe : describe,
        animation : google.maps.Animation.DROP,
    });
    
    //appViewModel.musical_places()[i].marker = marker;
    var infowindow = new google.maps.InfoWindow();
    var largeinfowindow = new google.maps.InfoWindow();
    
    marker.addListener('click' , function(){
        populate_infowindow(this , largeinfowindow)
    });
    
    markers.push(marker);
    marker.setMap(map);
    i++;
}
}

function populate_infowindow (marker , infowindow){
    
    if (infowindow.marker != marker){
        infowindow.marker=marker;
        infowindow.setContent('<div>' + marker.name + '</div>');
        infowindow.open( map , marker);
        
        infowindow.addListener('closeclick' , function(){
             infowindow.setMarker(null);
         });
        
        //// to ADD data from wiki /////
        var placeOfMusic = marker.name;
        var wikiURL = 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=' +                                  placeOfMusic;
        var str = "";
        $.ajax({
            url: wikiURL,
            dataType: "jsonp",
            success: function (response) {
                console.log(response);
                var articleList = response[1];
                var locName = response[0];
                if (articleList.length > 0) 
                {
                    for (var article=0; article < articleList.length;article++) {
                        if (articleList.hasOwnProperty(article)) 
                        {
                            var element = articleList[article];
                            str = "<li><a href='https://en.wikipedia.org/wiki/" + element + "'>" + element +                             "</a></li>"
                        }
                    }
                } 
                else 
                {
                    str = "<li><a href='https://en.wikipedia.org/w/index.php?                                                           title=Special:Search&fulltext=1&search=" + locName.replace(' ', '+') + "'>" +                               locName + "</a></li>"
                }

                //// Create the infowindow content ////
                infowindow.setContent('<p><b>Cafe Name:</b> ' + marker.name + '</p>' + '<p><b>Address:                           </b>' + marker.address + '</p>' + '<p><b>commentt: </b>' + marker.commentt + '</p> '                         + '<p><b>describe: </b>' + marker.describe + '</p>');
                infowindow.marker = marker;
    }
  })             
 }
}




















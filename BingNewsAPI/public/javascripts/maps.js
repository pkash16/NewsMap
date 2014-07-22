
var map;
var infobox;
var marker;
var newsArray;
var articleOn;
var scale = localStorage.getItem('scale');
var filter = localStorage.getItem('filter');
var size = localStorage.getItem('size');

if (size == null || size == '') {
    size = '1';
}

if (scale == null || scale == 0 || scale == '') {
    scale = 1;
}

function initialize() {
    var mapOptions = {
        zoom: 2,
        center: new google.maps.LatLng(26.2, 17.3)
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    marker = new google.maps.Marker({ map: map, visible: true, position: new google.maps.LatLng(26.2, 17.3)});
    infobox = new InfoBox({
        content: document.getElementById("infobox"),
        disableAutoPan: false,
        maxWidth: 150,
        pixelOffset: new google.maps.Size(-140, 0),
        zIndex: null,
        boxStyle: {
            background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
            opacity: 0.75,
            width: "280px"
        },
        closeBoxMargin: "12px 4px 2px 2px",
        closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
        infoBoxClearance: new google.maps.Size(1, 1)
    });
    google.maps.event.addListener(map, 'click', function (event) {
        var url = '/geocode/?lat=' + event.latLng.lat() + '&lng=' + event.latLng.lng() + '&id=' + scale;
        prepareLoading();     
        $.get(url, function (data) {
            var requestJson = '/time/'+ data + '%20' + filter + '?size=' + size;
            $('#country').text(data);
            marker.setPosition(event.latLng);
            infobox.open(map, marker);
            map.panTo(marker.position);
            articleOn = 0;   
            $.getJSON(requestJson, update);
        });
    });
}


update = function (news) {
    newsArray = news;
    var len = newsArray.length - 1;
    if (articleOn > len) {
        articleOn = len;
        $('#loading').hide();
        return;
    }
    if (articleOn < 0) {
        articleOn = 0;
        $('#loading').hide();
        return;  
    }
    
    
    $('#title').html(newsArray[articleOn].title);
    $('#snip').html(newsArray[articleOn].snip);
    $('#url').html('<a target = "_blank" href = "' + newsArray[articleOn].link + '">Read more...</a>');
    $('#source').text(newsArray[articleOn].source);
    $('#date').html(newsArray[articleOn].time);

    $('#loading').fadeOut("fast", function () {
        $('#title').fadeIn("fast");
        $('#snip').fadeIn("fast");
        $('#url').fadeIn("fast");
        $('#source').fadeIn("fast");
        $('#date').fadeIn("fast");
        $('#forwards').fadeIn("fast");
        $('#backwards').fadeIn("fast");
    });
}

$('#forwards').click(function () {
    articleOn++;
    prepareLoading();
    update(newsArray);
});

$('#backwards').click(function () {
    articleOn--;
    prepareLoading();
    update(newsArray);
});

function prepareLoading() {
    $('#title').hide();
    $('#snip').hide();
    $('#url').hide();
    $('#source').hide();
    $('#date').hide();
    $('#forwards').hide();
    $('#backwards').hide();
    $('#loading').show();  
}

google.maps.event.addDomListener(window, 'load', initialize);

var request = require('request');
var geocode = require('geocoder');
var async = require('async');

/*exports.list = function (req, res) {
    var id = req.params.id;
    var url = 'https://www.bing.com/news/search?q=' + id;
    request(url, function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
            var jsonArray = scrapeHTML(body);
            res.send(jsonArray);
        }
    });
}*/

exports.timetable = function (req, res) {
    var id = req.params.id;
    var size = req.query.size;
    var endResult = [];
    var count = 0;
    async.whilst(
        function () {
        return count < size;
    },
        function (callback) {
        count++;
        var url = 'http://www.bing.com/news/search?q=' + id + '&first=' + count + '1';
        request(url, function (err, resp, body) {
            if (!err && resp.statusCode == 200) {
                endResult = endResult.concat(scrapeHTML(body));
            } 
        });
        setTimeout(callback, 500);
    },
        function (err) {
        res.send(endResult);
    });

}



exports.geocode = function (req, res) {
    var lat = req.query.lat;
    var lng = req.query.lng;
    var id = req.query.id;
    geocode.reverseGeocode(lat, lng, function (err, data) {
        if (err) res.end('error');
        if (data == null) {
            res.end('The Lost City of Atlantis');
        }else if (data.results.length == 0) {
            res.end('The Lost City of Atlantis');
        }
        else {
            var len = data.results.length;
            if ((len - id) < 0) {
                len = id;
            }
            var country = data.results[len-id].formatted_address;
            //var country = address.substring((address.lastIndexOf(',') + 1));
            //country = country.replace(/\s/g, '');
            res.end(country);
        }

    });
}


function scrapeHTML(body) {
    var tempArray = [];
    //remove excess html
    body = body.substring(body.search('<div class="NewsResultSet clearfix">') + 36).substring(0, body.search('<div class="RelatedSearchesAndActions">'));
    body = body.substring(0,body.search('<div id="CarouselbarV2_1Title">')) + body.substring(body.search('<div class="rightarrow">') + 24);
    //convert remaining html into json and push to array
    var numArticles = numOccurrences(body, 'sn_r',false);
    for (var i = 1; i < numArticles; i++) {
        var title = body.substring(nth_occurrence(body,'>',3) + 1,body.search('</a>'));
        var link = body.substring(body.search("a href=") + 8, body.search('target') - 2);
        var snip = body.substring(body.search('sn_snip">') + 9, body.search('</span>'));
        var source = body.substring(body.search('sn_src">') + 8,body.search('</cite>'));
        var time = body.substring(body.search('sn_tm">') + 7, nth_occurrence(body, '</span>', 2));
        
        var object = {title:title,link:link,snip:snip,source:source,time:time}; 
        tempArray.push(object);

        body = body.substring(nth_occurrence(body, '<div class="sn_r', 2));

    }
    
    return tempArray;

}

function numOccurrences(str, val, allowOverlapping) {
    str += ""; val += "";
    if (val.length <= 0) return str.length + 1;
    
    var n = 0, pos = 0;
    var step = (allowOverlapping)?(1):(val.length);
    
    while (true) {
        pos = str.indexOf(val, pos);
        if (pos >= 0) { n++; pos += step; } else break;
    }
    return (n);
}

function nth_occurrence(str, pat, n) {
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
    }
    return i;
}
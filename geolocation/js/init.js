"use strict";
// http://html5demos.com/geo
function success(position) {
    var coords = position.coords.latitude + ', ' + position.coords.longitude,
        s = document.querySelector('#status'),
        sql;

    s.innerHTML = coords;
    s.className = 'success';

    sql = 'select country, locality1 from geo.places where text="' + coords + '" limit 1'
    console.log(sql);
    window.Y.YQL(sql, initApp);
    // signedURL = makeSignedRequest(Y_KEY, Y_SECRET, yql);
    // loadJSON(signedURL);
}

function error(msg) {
    var s = document.querySelector('#status');
    s.innerHTML = typeof msg == 'string' ? msg : 'failed';
    s.className = 'fail';
}

function broadcast(msg) {
    var source;
    for(source in window.sources) {
        window.sources[source].callback(msg.query.results, msg.query.diagnostics.url.content);
    }
}

function initApp(msg) {
    var model, source;
    window.city = msg.query.results.place.locality1.content;
    window.country = msg.query.results.place.country.content;
    console.info(window.city + ', ' + window.country);
    window.sources = [];
    for(model in window.models) {
        source = new window.models[model]();
        source.populate(window.city, window.country);
        window.sources.push(source)
    }
}

/*
document.addEventListener('DOMContentLoaded',function() {
    var button = document.getElementById('findme');
    window.Y = new YUI();
    window.Y.use('yql');
    button.addEventListener('click', function() {
        if (navigator.geolocation) {
            document.querySelector('#status').innerHTML = 'checking...';
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            error('not supported');
        }
    });
});
*/

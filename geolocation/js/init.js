// http://html5demos.com/geo
function success(position) {
    var coords = position.coords.latitude + ', ' + position.coords.longitude,
        s = document.querySelector('#status'),
        yql;

    s.innerHTML = coords;
    s.className = 'success';

    yql = 'http://query.yahooapis.com/v1/public/yql?q=' +
          'select%20country%2C%20locality1%20from%20geo.places%20where%20text%3D%22' +
          encodeURIComponent(coords + '" limit 1') + "&format=json&callback=initApp"
    // console.log(decodeURIComponent(yql));
    signedURL = makeSignedRequest(Y_KEY, Y_SECRET, yql);
    loadJSON(signedURL);
}

function error(msg) {
    var s = document.querySelector('#status');
    s.innerHTML = typeof msg == 'string' ? msg : 'failed';
    s.className = 'fail';
}

function broadcast(msg) {
    for(source in window.sources) {
        window.sources[source].callback(msg.query.results, msg.query.diagnostics.url.content);
    }
}

function initApp(msg) {
    var source;
    window.city = msg.query.results.place.locality1.content;
    window.country = msg.query.results.place.country.content;
    window.sources = [];
    for(model in window.models) {
        source = new window.models[model]();
        source.populate(window.city, window.country);
        window.sources.push(source)
    }
}

document.addEventListener('DOMContentLoaded',function() {
    if (navigator.geolocation) {
        document.querySelector('#status').innerHTML = 'checking...';
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        error('not supported');
    }
});

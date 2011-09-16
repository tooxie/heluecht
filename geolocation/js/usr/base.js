requireModules();

dojo.ready(function() {
    if(!checkAll()) {
        alert('Upgrade browser.');
    } else {
        if(navigator.onLine) {
            isAndroid();
            online();
        } else {
            offline();
        }
    }
});

function checkAll() {
    try {
        if(!navigator.geolocation) {
            return false;
        }

        if(!localStorage) {
            return false;
        }
    } catch(e) {
        return false;
    }

    return true;
}

function getNamespace() {
    return 'catsei';
}

function online() {
    navigator.geolocation.getCurrentPosition(success, error);
}

function offline() {
    // dojox.mobile.parser.parse('menu');
    render();
}

function render() {
    // Put custom widgets here.
    var coords = retrieve('position')['coords'];
    console.info(coords);
    window.map = lib.map({
        latitude: coords.latitude,
        longitude: coords.longitude
    });
    window.news = sources.NewsView({
        online: navigator.onLine,
        container: document.getElementById('newsList')
    });
    window.weather = sources.WeatherView({
        online: navigator.onLine,
        currentContainer: document.getElementById('weatherCurrent'),
        forecastContainer: document.getElementById('weatherForecast')
    });
}

function isAndroid() {
    // Create a new LINK element, get reference to the HEAD tag which we'll inject it into
    var l = document.createElement("link"), h = document.getElementsByTagName("head")[0];
    // Is this Android?
    var isAndroid = navigator.userAgent.indexOf("Android") > -1;
    // isAndroid = true;
    // Add the appropriate stylesheet designations.
    l.setAttribute("rel", "stylesheet");
    themesURL = "http://ajax.googleapis.com/ajax/libs/dojo/1.6.0/dojox/mobile/themes/";
    l.setAttribute("href", themesURL + (isAndroid ? "android/android.css" : "iphone/iphone.css"));
    // Inject into header.
    h.insertBefore(l, h.firstChild);
}

function requireModules() {

    dojo.require("dojox.mobile.parser");
    dojo.require("dojox.mobile");
    // dojo.require("dojox.mobile.ScrollableView");
    dojo.requireIf(!dojo.isWebKit, "dojox.mobile.compat");

    if(navigator.onLine) {
        dojo.require('lib.map');
    }

    // Load custom views here.
    dojo.require("sources.NewsView");
    dojo.require("sources.WeatherView");
}

function error(GeoPositionError) {
    var error_codes = {},
        title = document.getElementById('title');

    error_codes[0] = 'Unknown error';
    error_codes[GeoPositionError.PERMISSION_DENIED] = 'Permission denied';
    error_codes[GeoPositionError.POSITION_UNAVAILABLE] = 'Position unavailable';
    error_codes[GeoPositionError.TIMEOUT] = 'Timeout';

    title.className = 'error';
    title.innerHTML = error_codes[GeoPositionError.code];
}

function success(position) {
    var coords, query;
    coords = position.coords.latitude + ', ' + position.coords.longitude;
    query = 'select admin1, country from geo.places where text="' + coords + '" limit 1';
    lib.yql(query, {
        load: function(geoData) {
            var city = geoData.results.place.admin1.content,
                country = geoData.results.place.country.content;
            store('position', {
                address: {
                    city: city,
                    country: country
                },
                coords: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            });
            document.getElementById('title').innerHTML = city + ', ' + country;
            document.getElementById('menuList').style.display = 'block';
            render();
        }
    });
}

function store(key, value) {
    var orig_val;

    if(key === null || key === undefined) {
        throw "StorageError: No key provided";
    }

    if(value === null || value === undefined) {
        throw "StorageError: No value provided";
    }

    orig_val = JSON.parse(localStorage.getItem(getNamespace()) || '{}');
    orig_val[key] = value;
    localStorage.setItem(getNamespace(), JSON.stringify(orig_val));
}

function retrieve(key) {
    // TODO: This parses the JSON object everytime an item is requested. This
    // TODO: can/should be cached.
    return JSON.parse(localStorage.getItem(getNamespace()))[key];
}

"use strict";
console.info(localStorage);
requireModules();

dojo.ready(function() {
    if(!checkAll()) {
        setTitle('Unsupported browser');
    } else {
        loadPlatformTheme();
        if(navigator.onLine) {
            console.log('navigator online');
            online();
        } else {
            console.log('navigator offline');
            offline();
        }
        setupRefresh();
        setupCache();
    }
});


// --- custom modules --- //

function loadCustomModules() {
    // Load custom views here.
    dojo.require("sources.NewsView");
    dojo.require("sources.WeatherView");
}

function renderCustomModules(update) {
    // Put custom widgets here.
    window.news = sources.NewsView({
        update: update,
        data: retrieve('news'),
        container: document.getElementById('newsList')
    });
    window.weather = sources.WeatherView({
        update: update,
        data: retrieve('weather'),
        currentContainer: document.getElementById('weatherCurrent'),
        forecastContainer: document.getElementById('weatherForecast')
    });
}


// --- functions --- //

function requireModules() {
    dojo.require("dojox.mobile.parser");
    dojo.require("dojox.mobile");
    dojo.requireIf(!dojo.isWebKit, "dojox.mobile.compat");

    dojo.require('lib.map');

    loadCustomModules();
}

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

function loadPlatformTheme() {
    var h = document.getElementsByTagName("head")[0],
        isAndroid = navigator.userAgent.indexOf("Android") > -1,
        l = document.createElement("link"),
        themesURL;

    l.setAttribute("rel", "stylesheet");
    themesURL = "http://ajax.googleapis.com/ajax/libs/dojo/1.6.0/dojox/mobile/themes/";
    l.setAttribute("href", themesURL + (isAndroid ? "android/android.css" : "iphone/iphone.css"));
    h.insertBefore(l, h.firstChild);
}

function online(changedCity) {
    if(changedCity === undefined) {
        navigator.geolocation.getCurrentPosition(getAddress, geoError);
    } else {
        if(changedCity === true) {
            console.log('city changed');
            renderModules(true);
        } else {
            console.log('same city');
            renderModules(false);
        }
    }
}

function offline() {
    var address,
        position = retrieve('position');

    document.getElementById('refresh').style['display'] = 'none';
    if(position == undefined) {
        console.error('ERROR');
        setTitle('ERROR', error=true);
        return;
    }

    address = position['address'];
    displayMenu(address.city + ', ' + address.country);
    renderModules();
}


// --- events --- //

function cacheUpdateReady() {
    console.log('application cache updated');
}

function setupCache() {
    window.applicationCache.addEventListener('updateready', cacheUpdateReady());
    if(window.applicationCache.status === window.applicationCache.UPDATEREADY) {
        cacheUpdateReady();
    }
}

function setupRefresh() {
    var refresh = document.getElementById('refresh');

    window.addEventListener("offline", function(e) {
        refresh.style['display'] = 'none';
    })
    window.addEventListener("online", function(e) {
        refresh.style['display'] = 'block';
    })
    refresh.addEventListener("click", function(e) {
        console.log('refreshing...');
        setTitle('Loading...');
        wipeStorage();
        online();
    })
}


// --- auxiliary functions --- //

function getNamespace() {
    return 'catsei';
}

function displayMenu(title) {
    console.log('displaying title and menu');
    setTitle(title);
    document.getElementById('menuList').style.display = 'block';
}

function setTitle(msg, error) {
    var title = document.getElementById('title');

    if(error === true) {
        title.classList.add('error');
    } else {
        title.classList.remove('error');
    }
    title.innerHTML = msg;
}

function renderModules(update) {
    var coords = retrieve('position')['coords'];

    console.log('rendering modules');
    if(update === undefined) {
        update = navigator.onLine;
    }
    if(update) {
        console.log('modules update content');
    } else {
        console.log('modules don\'t update');
    }
    document.getElementById('menumap').addEventListener('click', function() {
        if(!window.map && lib.map) {
            window.map = lib.map({
                latitude: coords.latitude,
                longitude: coords.longitude
            });
        }
    });

    renderCustomModules(update);
}


// --- geolocation --- //

function getAddress(position) {
    var coords, query;

    console.log('guessing city...');
    coords = position.coords.latitude + ', ' + position.coords.longitude;
    query = 'select admin1, country from geo.places where text="' + coords + '" limit 1';
    lib.yql(query, {
        load: function(geoData) {
            var city = geoData.results.place.admin1.content,
                country = geoData.results.place.country.content;

            updateCity({
                address: {
                    city: city,
                    country: country
                },
                coords: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            });
        }
    });
}

function updateCity(position) {
    var _position = retrieve('position'),
        changed = false;

    if(_position === undefined) {
        changed = true;
    } else {
        if(_position.address.city !== position.address.city) {
            changed = true;
        }
        if(_position.address.country !== position.address.country) {
            changed = true;
        }
    }
    if(changed) {
        console.log('city changed, we are now in ' + position.address.city);
    } else {
        console.log('we are still in ' + position.address.city);
    }
    displayMenu(position.address.city + ', ' + position.address.country);
    store('position', position);
    online(changed);
}

function geoError(GeoPositionError) {
    var error_codes = {};

    error_codes[0] = 'Unknown error';
    error_codes[GeoPositionError.PERMISSION_DENIED] = 'Permission denied';
    error_codes[GeoPositionError.POSITION_UNAVAILABLE] = 'Position unavailable';
    error_codes[GeoPositionError.TIMEOUT] = 'Timeout';

    setTitle(error_codes[GeoPositionError.code], error=true);
}


// --- localStorage --- //

function store(key, value) {
    var orig_val;

    if(key === null || key === undefined) {
        throw "StorageError: No key provided";
    }

    if(value === null || value === undefined) {
        throw "StorageError: No value provided";
    }

    orig_val = dojo.fromJson(localStorage.getItem(getNamespace()) || '{}');
    orig_val[key] = value;
    localStorage.setItem(getNamespace(), dojo.toJson(orig_val));
    console.log('stored ' + key);
}

function retrieve(key) {
    // TODO: This parses the JSON object everytime an item is requested. This
    // TODO: can/should be cached.
    try {
        if(key === undefined) {
            return dojo.fromJson(localStorage.getItem(getNamespace()));
        } else {
            return dojo.fromJson(localStorage.getItem(getNamespace()))[key];
        }
    } catch(e) {
        return undefined
    }
}

function wipeStorage() {
    console.log('destroying storage contents');
    delete localStorage[getNamespace()];
}

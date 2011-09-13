dojo.ready(function() {
    function error(GeoPositionError) {
        var error_codes = {};

        error_codes[0] = 'Unknown error';
        error_codes[GeoPositionError.PERMISSION_DENIED] = 'Permission denied';
        error_codes[GeoPositionError.POSITION_UNAVAILABLE] = 'Position unavailable';
        error_codes[GeoPositionError.TIMEOUT] = 'Timeout';

        dojo.byId('status').innerHTML = error_codes[GeoPositionError.code];
    }

    function success(position) {
        var city, query;
        // debug
        console.info(position);
        dojo.require('dojox.yql');
        city = position.address.city + ', ' + position.address.country
        query = "select * from google.igoogle.weather where weather='" + city + "'";
        // debug
        console.log(query);
        dojox.yql(query, {
            load: function(weatherData) {
                try {
                    store('weather', weatherData.results.weather);
                    // debug
                    console.log('stored weather!');
                } catch(e) {
                    // debug
                    console.info(e);
                }
            }
        });

        rss = "http://news.search.yahoo.com/rss?ei=UTF-8&p=" + encodeURIComponent(city);
        query = 'select * from rss where url="' + rss + '"';
        dojox.yql(query, {
            load: function(newsData) {
                try {
                    store('news', newsData.results);
                    // debug
                    console.log('stored news!');
                } catch(e) {
                    // debug
                    console.info(e);
                }
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
        return 'heluecht';
    }

    function render() {
        dojo.byId('workspace').innerHTML = 'Here goes content.';
    }

    function offline() {
        // debug
        console.log('offline');
        dojo.byId('status').innerHTML = 'You are offline.';
        // debug
        console.info(localStorage[getNamespace()]);
        render();
    }

    // debug
    console.info(localStorage.length + ' items in Storage.');

    if(navigator.onLine) {
        // debug
        console.log('online');
        if(!checkAll()) {
            alert('Upgrade browser.');
        } else {
            dojo.byId('status').innerHTML = 'Checking...';
            navigator.geolocation.getCurrentPosition(success, error);
        }
    } else {
        offline();
    }

    // TODO: Never hits this.
    function onUpdateReady() {
        // debug
        console.log('New cache version!');
    }

    window.applicationCache.addEventListener('updateready', onUpdateReady);
    if(window.applicationCache.status === window.applicationCache.UPDATEREADY) {
        onUpdateReady();
    }
});

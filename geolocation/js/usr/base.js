dojo.ready(function() {
    // debug
    console.info(localStorage.length + ' items in Storage.');

    if(navigator.onLine) {
        // debug
        console.log('online');
        if(!checkAll()) {
            alert('Upgrade browser.');
        } else {
            // dojo.byId('status').innerHTML = 'Checking...';
            navigator.geolocation.getCurrentPosition(success, error);
        }
    } else {
        offline();
    }
});

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
    document.getElementById('title').innerHTML = position.address.city + ', ' + position.address.country;
    document.getElementById('menuList').style.display = 'block';
    // debug
    console.info(position);
    store('position', {
        address: {
            city: position.address.city,
            country: position.address.country
        },
        coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
    });
    render();
}

function store(key, value) {
    var orig_val;

    if(key === null || key === undefined) {
        throw "StorageError: No key provided";
    }

    if(value === null || value === undefined) {
        throw "StorageError: No value provided";
    }

    console.info(value);

    orig_val = JSON.parse(localStorage.getItem(getNamespace()) || '{}');
    orig_val[key] = value;
    localStorage.setItem(getNamespace(), JSON.stringify(orig_val));
}

function retrieve(key) {
    // TODO: This parses the JSON object everytime an item is requested. This
    // TODO: can/should be cached.
    return JSON.parse(localStorage.getItem(getNamespace()))[key];
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

function offline() {
    // debug
    console.log('offline');
    dojo.byId('status').innerHTML = 'You are offline.';
    // debug
    console.info(localStorage[getNamespace()]);
    render();
}

// Declare Dojo package name
dojo.provide("lib.map");

// Declare Dojo widget name. This widget extends the Label widget
dojo.declare("lib.map", null, {
    latitude: null,
    longitude: null,
    googleKey: 'ABQIAAAAEvV7AQjZLv0itwLFSt0IzxRx4N6pI3W7lfSElFmUx1_Ykxmo6BR1eo8NoQmWcjf6hxgzVsq-sZYoTQ',

    constructor: function(args) {
        console.info(args);
        dojo.safeMixin(this, args);
        console.info(this.latitude);
    },

    postMixInProperties: function() {
        this.id=dijit.getUniqueId('map');
        var script = dojo.byId('api');
        if(!script){
            // create the callback handler script to redirect the callback to this widget
            script = document.createElement("script");
            script.type = "text/javascript";
            script.text = "function googleCallback(data){ dijit.byId('"+this.id+"').googleCallback(data)}";
            dojo.doc.getElementsByTagName("head")[0].appendChild(script);

            // create the script to load the google maps api
            script = document.createElement("script");
            script.type = "text/javascript";
            script.id="api";
            script.src = "http://maps.google.com/maps?file=api&v=2.x&sensor=false&key="+this.googleKey+"&async=2&callback=googleCallback";
            dojo.doc.getElementsByTagName("head")[0].appendChild(script);
        }
        else{
            googleCallback();
        }
    },

    googleCallback: function(data){
        var mapNode = document.getElementByid('gmap');
        mapNode.style.height = '460px';
        mapNode.style.width = '400px';
        // dojo.doc.body.appendChild(mapNode);

        // FIXME: GMap2 is not defined.
        var map = new GMap2(mapNode);
        map.setCenter(new GLatLng(this.latitude, this.longitude), 13);
    }
});

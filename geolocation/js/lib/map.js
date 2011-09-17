"use strict";
// Declare Dojo package name
dojo.provide("lib.map");

// Declare Dojo widget name. This widget extends the Label widget
dojo.declare("lib.map", null, {
    latitude: null,
    longitude: null,
    sensor: false,

    constructor: function(args) {
        dojo.safeMixin(this, args);
        this.loadAPI();
    },

    loadAPI: function() {
        var script = document.getElementById('gmapsapi');

        this.id = dijit.getUniqueId('map');
        if(!script){
            // create the script to load the google maps api
            script = document.createElement("script");
            script.type = "text/javascript";
            script.id = "api";
            script.src = "http://maps.googleapis.com/maps/api/js?sensor=" + this.sensor + "&callback=map.googleCallback";
            dojo.doc.getElementsByTagName("head")[0].appendChild(script);
        }
        else{
            this.googleCallback();
        }
    },

    googleCallback: function(data){
        var latlng = new google.maps.LatLng(this.latitude, this.longitude),
            map,
            myOptions;

        myOptions= {
            zoom: 14,
            center: latlng,
            draggable: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("gmap"), myOptions);
    }
});

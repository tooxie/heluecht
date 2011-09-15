// Weather data source
dojo.provide("sources.WeatherView");

// Dependencies here
dojo.require("dojox.mobile.ScrollableView");
dojo.require("lib.yql");
// dojo.require("dojo.DeferredList");
// dojo.require("dojo.io.script");

// Require localization for time
// dojo.require("dojo.i18n");
// dojo.requireLocalization("dojo.cldr", "gregorian", "", "");

// Widget
dojo.declare("sources.WeatherView", [dojox.mobile.ScrollableView], {
    constructor: function(args) {
        if(args.online) {
            this.populate();
        }
        dojo.safeMixin(this, args);
    },
    title: 'No title',
    pubDate: '',
    link: '',
    description: '',
    populate: function () {
        var city, query, position, rss;
        position = retrieve('position');
        // debug
        // console.info(position);
        city = position.address.city + ', ' + position.address.country;
        query = "select * from google.igoogle.weather where weather='" + city + "';";
        // debug
        // console.log(query);
        lib.yql(query, {
            load: function(weatherData) {
                // TODO: Verificar que se esté guardando.
                store('weather', weatherData.results.xml_api_reply.weather);
            }
        });
    },
    render: function() {
    }
});
// :wq

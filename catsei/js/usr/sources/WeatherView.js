"use strict";
// Weather data source
dojo.provide("sources.WeatherView");

// Dependencies here
dojo.require("lib.ViewMixin");
dojo.require("dojox.mobile.ScrollableView");
dojo.require("lib.yql");

// Widget
dojo.declare("sources.WeatherView", [dojox.mobile.ScrollableView, lib.ViewMixin], {
    currentTemplate: '<img src="http://google.com${icon}" alt="${condition}">' +
    '<div>${condition}</div>' +
    '<div>${humidity}</div>' +
    '<div>${temp_c}&deg;C / ${temp_f}&deg;F</div>' +
    '<div>${wind_condition}</div>' +
    '<div style="clear:both">Last update: ${last_update}</div>',
    forecastTemplate:'<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">' +
    '<h3>${day_of_week}</h3>' +
    '<img src="http://google.com${icon}" alt="${condition}">' +
    '<p style="font-weight:normal;">${condition}</p>' +
    '<p style="font-weight:normal;">High: ${high}&deg;F / Low: ${low}&deg;F</p>' +
    '</li>',

    constructor: function(args) {
        var att;

        dojo.safeMixin(this, args);
        if(args.update) {
            this.populate();
        } else {
            if(args.data) {
                for(att in args.data) {
                    this[att] = args.data[att];
                }
            }
            this.currentContainer.innerHTML = this.renderCurrent();
            dojox.mobile.parser.parse(this.currentContainer);
            this.forecastContainer.innerHTML = this.renderForecast();
            dojox.mobile.parser.parse(this.forecastContainer);
        }
    },

    populate: function () {
        var city, query, position, rss;

        position = retrieve('position');
        city = position.address.city + ', ' + position.address.country;
        query = "select * from google.igoogle.weather where weather='" + city + "';";
        lib.yql(query, {
            load: function(weatherData) {
                store('weather', weatherData.results.xml_api_reply.weather);
                // Ugly hack =(
                weather.currentContainer.innerHTML = weather.renderCurrent();
                dojox.mobile.parser.parse(weather.currentContainer);
                weather.forecastContainer.innerHTML = weather.renderForecast();
                dojox.mobile.parser.parse(weather.forecastContainer);
            }
        });
    },

    renderCurrent: function() {
        var current,
            information,
            weatherData = retrieve('weather');

        if(!weatherData) {
            return '';
        }
        current = weatherData['current_conditions'];
        information = weatherData['forecast_information'];
        return this.substitute(this.currentTemplate, {
            condition: current.condition.data,
            humidity: current.humidity.data,
            icon: current.icon.data,
            temp_c: current.temp_c.data,
            temp_f: current.temp_f.data,
            wind_condition: current.wind_condition.data,
            last_update: information.current_date_time.data
        });
    },

    renderForecast: function() {
        var current,
            days,
            dow,
            forecast = retrieve('weather'),
            forecast_html = '',
            x;

        if(!forecast) {
            return '';
        } else {
            forecast = forecast['forecast_conditions'];
        }
        days = {
            Mon: 'Monday',
            Tue: 'Tuesday',
            Wed: 'Wednsday',
            Thu: 'Thursday',
            Fri: 'Friday',
            Sat: 'Saturday',
            Sun: 'Sunday'
        }
        for(x = 0; x < forecast.length; x += 1) {
            current = forecast[x];
            if(x === 0) {
                dow = 'Today';
            } else {
                dow = days[current.day_of_week.data];
            }
            forecast_html += this.substitute(this.forecastTemplate, {
                day_of_week: dow,
                icon: current.icon.data,
                condition: current.condition.data,
                high: current.high.data,
                low: current.low.data
            });
        }
        return forecast_html;
    }
});
// :wq

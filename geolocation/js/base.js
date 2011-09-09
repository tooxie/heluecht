"use strict";
document.addEventListener('DOMContentLoaded',function() {
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };

    window.collections = Array();
    window.models = Array();
    window.sources = Array();

    window.DataSource = Backbone.Model.extend({

        defaults: function() {
            return {
                'name': 'N/A',
                'author': 'N/A',
                'email': 'N/A',
                'version': '0.1'
            };
        },

        init: function(city, country) {
            throw "NotImplementedError";
        },

        get_callback: function() {
            return 'App.broadcast';
        },

        contents: function() {
            throw "NotImplementedError";
        },

        callback: function(msg) {
            throw "NotImplementedError";
        }

    });


    window.AppView = Backbone.Model.extend({

        el: document.getElementById('workspace'),

        defaults: function() {
            return {
                'pending': Array()
            }
        },

        initialize: function() {
            var button = document.getElementById('findme');
            window.Y = new YUI();
            window.Y.use('yql');
            button.addEventListener('click', function() {
                if (navigator.geolocation) {
                    document.querySelector('#status').innerHTML = 'checking...';
                    navigator.geolocation.getCurrentPosition(App.success, App.error);
                } else {
                    error('not supported');
                }
            });
        },

        success: function(position) {
            var model,
                s = document.getElementById('status'),
                source,
                x;

            window.city = position.address.city;
            window.country = position.address.country;
            window.region = position.address.region;
            window.latitude = position.coords.latitude;
            window.longitude = position.coords.longitude;

            s.innerHTML = window.latitude + ', ' + window.longitude;
            s.className = 'success';

            // debug
            console.log(window.city + ', ' + window.region + ', ' + window.country)
            console.info(models);
            for(x = 0; x <= window.models.length - 1; x += 1) {
                source = new window.models[x]();
                // debug
                console.info(source);
                source.populate(window.city, window.country);
                window.sources.push(source)
            }
        },

        error: function(msg) {
            var s = document.getElementById('status');
            s.innerHTML = typeof msg == 'string' ? msg : 'failed';
            s.className = 'fail';
        },

        broadcast: function(msg) {
            var pending = App.get('pending'),
                x = 0;

            // debug
            console.log('App.broadcast');
            console.info(pending);

            for(x = 0; x <= pending.length - 1; x += 1) {
                // debug
                console.log(pending[x]);
                try {
                    if(pending[x].callback(msg) === true) {
                        pending.remove(x);
                        // debug
                        console.log('removed: ' + x)
                        console.info(pending);
                        return true;
                    }
                } catch(e) {
                    // debug
                    console.log(e);
                    return false;
                }
                return false;
            }
            // debug
            console.info(msg);
            return false;
        },

        addPending: function(callback) {
            // debug
            console.log('App.addPending');
            console.info(callback);
            this.get('pending').push(callback)
        },

        executeYQL: function(sql, callback, params) {
            // debug
            console.log('App.executeYQL: ' + sql);
            this.addPending(callback);
            Y.YQL(sql, App.broadcast, params)
        },

        // FIXME: Chequear si esto sirve para algo, si vale la pena tenerlo.
        makeRequest: function(key, secret, url) {
            var signedURL = this.makeSignedRequest(key, secret, url);
            this.loadJSON(signedURL);
        },

        // http://www.hunlock.com/blogs/Mastering_JSON_(_JavaScript_Object_Notation_)#quickIDX11
        loadJSON: function(url) {
            var headID = document.getElementsByTagName("head")[0],
                newScript = document.createElement('script');
            newScript.type = 'text/javascript';
            newScript.src = url;
            headID.appendChild(newScript);
        }

    });

    window.App = new AppView;  // Kick off the app.
});

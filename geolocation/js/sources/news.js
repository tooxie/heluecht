"use strict";
document.addEventListener('DOMContentLoaded',function() {
    window.models.push(DataSource.extend({

        defaults: function() {
            return {
                'name': 'Local news',
                'author': 'Alvaro Mouriño',
                'email': 'alvaro@mourino.net',
                'version': '0.1',
                'items': Array()
            };
        },

        populate: function(city, country) {
            // debug
            console.log('populate');
            this.set({
                'city': city,
                'country': country
            });
            App.executeYQL(this.getYQL(), this, {'diagnostics': true, 'format': 'json'});
        },

        getRSS: function() {
            var city = encodeURIComponent(this.get('city') + ", " + this.get('country'));
            // debug
            console.log('getRSS');
            return 'http://news.search.yahoo.com/rss?ei=UTF-8&p=' + city;
        },

        getYQL: function() {
            var enccback = encodeURIComponent(this.get_callback());
            // debug
            console.log('getYQL');
            return 'select * from rss where url="' + this.getRSS(city, country) + '"'
        },

        setItem: function(item) {
            var items = this.get('items');
            items.push(item);
        },

        callback: function(msg) {
            var i, items, x;
            // debug
            console.log('callback!');
            console.info(msg);
            console.log(msg.query.diagnostics.url[1].content + ' == ' + this.getRSS());
            if(msg.query.diagnostics.url[1].content == this.getRSS()) {
                items = msg.query.results.item;
                for(x = 0; x < items.length; x += 1) {
                    this.setItem({
                        'title': items[x].title,
                        'link': items[x].link,
                        'description': items[x].description
                    });
                }
                // debug
                console.log('equal');
                console.info(this.get('items'));
                return true;
            }
            // debug
            console.log('not equal');
            return false;
        }

    }));

    window.collections.NewsCollection = Backbone.Collection.extend({

        model: models['NewsDataSource'],

        localStorage: new Store("news")

    });
});

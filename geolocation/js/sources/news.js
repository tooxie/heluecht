document.addEventListener('DOMContentLoaded',function() {
    window.models.NewsDataSource = DataSource.extend({

        defaults: function() {
            return {
                'name': 'Local news',
                'author': 'Alvaro Mouriño',
                'email': 'alvaro@mourino.net',
                'version': '0.1'
            };
        },

        populate: function(city, country) {
            var signedURL;
            this.set({
                'city': city,
                'country': country
            });
            signedURL = makeSignedRequest(Y_KEY, Y_SECRET, this.get_yql());
            loadJSON(signedURL);
        },

        get_rss: function() {
            var city = encodeURIComponent(this.get('city') + ", " + this.get('country'));
            return encodeURIComponent('http://news.search.yahoo.com/rss?ei=UTF-8&amp;p=' + city);
        },

        get_yql: function() {
            var enccback = encodeURIComponent(this.get_callback());
            return 'http://query.yahooapis.com/v1/public/yql?q=select%20*' +
                   '%20from%20rss%20where%20url%3D%22' + this.get_rss(city, country) +
                   '%22&diagnostics=true&format=json&callback=' + enccback;
        },

        callback: function(query, url) {
            var item;
            if(url == decodeURIComponent(this.get_rss())) {
                for(i in query.item) {
                    item = console.log(query.item[i]);
                }
            }
        }
    });
});

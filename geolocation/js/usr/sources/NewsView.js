// News data source
dojo.provide("sources.NewsView");

// Dependencies here
dojo.require("lib._ViewMixin");
dojo.require("dojox.mobile.ScrollableView");
dojo.require("lib.yql");

// Widget
dojo.declare("sources.NewsView", [dojox.mobile.ScrollableView, lib._ViewMixin], {

    container: null,
    title: 'No title',
    pubDate: '',
    link: '',
    description: '',
    templateString: '<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">' +
    '<h3>${title}</h3>' +
    '<p><a href="${link}">${link}</a></p>' +
    '<p style="font-weight:bold;">${pubDate}</p>' +
    '<p style="font-weight:normal;">${description}</p>' +
    '</li>',

    constructor: function(args) {
        dojo.safeMixin(this, args);
        if(args.online) {
            this.populate();
        } else {
            this.container.innerHTML = this.render();
            dojox.mobile.parser.parse(this.container);
        }
    },

    populate: function() {
        var city, query, position, rss;
        position = retrieve('position');
        city = position.address.city + ', ' + position.address.country;
        rss = "http://news.search.yahoo.com/rss?ei=UTF-8&p=" + encodeURIComponent(city);
        query = 'select * from rss where url="' + rss + '"';
        lib.yql(query, {
            load: function(newsData, params) {
                store('news', newsData.results.item);
                // Ugly hack =(
                news.container.innerHTML = news.render();
                dojox.mobile.parser.parse(news.container);
            }
        });
    },

    render: function() {
        var news_html = '',
            news_list = retrieve('news'),
            x;
        for(x = 0; x < news_list.length - 1; x += 1) {
            news_html += this.substitute(this.templateString, {
                title: news_list[x]['title'],
                link: news_list[x]['link'],
                pubDate: news_list[x]['pubDate'],
                description: news_list[x]['description']
            });
        }
        return news_html;
    }
});
// :wq

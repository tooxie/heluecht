// News data source
dojo.provide("sources.NewsView");

// Dependencies here
dojo.require("lib._ViewMixin");
dojo.require("dojox.mobile.ScrollableView");
dojo.require("lib.yql");
// dojo.require("dojo.DeferredList");
// dojo.require("dojo.io.script");

// Require localization for time
// dojo.require("dojo.i18n");
// dojo.requireLocalization("dojo.cldr", "gregorian", "", "");

// Widget
dojo.declare("sources.NewsView", [dojox.mobile.ScrollableView, lib._ViewMixin], {
    constructor: function(args) {
        console.log('__init__()');
        dojo.safeMixin(this, args);
        if(args.online) {
            this.populate();
        }
    },
    title: 'No title',
    pubDate: '',
    link: '',
    description: '',
    templateString: '<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem"><h3>${title}</h3>' +
    '<p><a href="${link}">${link}</a></p>' +
    '<p>${description}</p>' +
    '</li>',
    populate: function() {
        var city, query, position, rss;
        position = retrieve('position');
        console.log('position');
        console.info(position);
        city = position.address.city + ', ' + position.address.country;
        rss = "http://news.search.yahoo.com/rss?ei=UTF-8&p=" + encodeURIComponent(city);
        query = 'select * from rss where url="' + rss + '"';
        lib.yql(query, {
            load: function(newsData) {
                // TODO: Verificar que se esté guardando.
                store('news', newsData.results.item);
            }
        });
    },
    render: function() {
        var news_container = document.getElementById("newsList"),
            news_list = retrieve('news'),
            x;
        console.log('render()');
        for(x = 0; x < news_list.length - 1; x += 1) {
            news_container.innerHTML += this.substitute(this.templateString, {
                title: news_list[x]['title'],
                link: news_list[x]['link'],
                description: news_list[x]['description']
            });
        }
    }
});
// :wq

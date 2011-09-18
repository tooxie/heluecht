"use strict";
dojo.provide("lib.yql._base");
dojo.require("dojo.io.script");
/*
 * Begin Yahoo Web Services Attribution Snippet
 * http://developer.yahoo.com - Web Services by Yahoo!
 * End Yahoo Web Services Attribution Snippet
 */
(function(d){

    var URL = 'http://query.yahooapis.com/v1/public/yql';

    lib.yql = function(query, ioArgs){
        // summary: An interface to Yahoo's YQL web service
        //
        // description:
        //      An interface to Yahoo's YQL web service. See
        //      http://developer.yahoo.com/yql/ for full information
        //      and to obtain the an API key.
        //
        // query: String
        //      Some YQL query to execute. eg: "select * from internet"
        //
        // ioArgs: Object?
        //      A Standard Dojo XHR ioArgs object, with special consideration:
        //
        //        * No `url` needs specified as it it hardcoded to point to YAHOO's
        //        service.
        //        * Any other options should behave as expected, though
        //        for the sake of not breaking the interface it is suggested you
        //        avoid using the `form` parameters.
        //        * `ioArgs.diagnostics` can be passed to trigger diagnostic information (?)
        //        * `ioArgs.env` can be passed to supply a different datatable evn (?)
        //
        // example:
        //  |   var handleIt = function(data){ console.warn(data); };
        //  |   lib.yql("select * from internet").addCallback(handleIt);
        //
        // example:
        //  |   lib.yql("select geo.places where text = 'SFO'", {
        //  |       load: function(data){ console.dir(data); }
        //  |   });
        //
        // example:
        //  |   lib.yql("select * from internet", {
        //  |       error: function(e){ handleIt(e); }
        //  |   }).addCallback(handleIt);
        //
        // example:
        //  |   lib.yql("select * from internet", {
        //  |       timeout:5000,
        //  |       error: function(e){ handleIt(e); },
        //  |       load: handleIt
        //  |   });
        //
        //  example:
        //  |   lib.yql("select it").addBoth(function(dataOrError){ ... });

        var args = d.mixin({
            url: URL,
            callbackParamName: "callback",
            content: {}
        }, ioArgs || {});

        d.mixin(args.content, {
            q: query, format:"json",
            diagnostics: args.diagnostics && args.diagnostics === "true" || args.diagnostics === true,
            env: args.content.env || args.env || 'http://datatables.org/alltables.env'
        });

        // we need to make a new Deferred because we want to regulate the callbacks passed
        // in `ioArgs`. Attach those to this new deferred, which will be returned.
        var dfd = new d.Deferred();

        args.load && dfd.addCallback(args.load);
        args.error && dfd.addErrback(args.error);
        args.handle && dfd.addBoth(args.handle);

        // kill old load/error function if any at all so we can fire err/callback based on data.error,
        // as json-p doesn't have traditional errors (though 404's etc will throw methinks?)
        args.load = function(data){
            var it = data.error || data.query;
            dfd[(data.error ? "err" : "call") + "back"](it);
        };
        args.error = function(e){ dfd.errback(e); };
        args.handle = null; // sokay, we bound an original before here

        d.io.script.get(args);

        return dfd;

    };

})(dojo);

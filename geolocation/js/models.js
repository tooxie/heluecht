document.addEventListener('DOMContentLoaded',function() {
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
            return 'broadcast';
        },

        contents: function() {
            throw "NotImplementedError";
        },

        callback: function(msg) {
            throw "NotImplementedError";
        }

    });
});

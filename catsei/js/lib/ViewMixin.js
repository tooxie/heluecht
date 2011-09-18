"use strict";
// Provide the class
dojo.provide("lib.ViewMixin");

// Declare the class
dojo.declare("lib.ViewMixin", null, {
    // Pushes data into a template - primitive
    substitute: function(template, obj) {
        return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(match, key){
            return obj[key];
        });
    },

    // Get elements by CSS class name
    getElements: function(cssClass, rootNode) {
        return (rootNode || dojo.body()).getElementsByClassName(cssClass);
    }
});

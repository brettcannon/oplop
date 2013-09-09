'use strict';

define('oplop/impl', [], function() {
    var exports = {};

    /* Plain HTML implementation has no special implementation "stuff". */

    /* Get storage data.
       Asynchronous to make Chrome happy. */
    exports.getStorage = function(key, callback) {
        var value = localStorage.getItem(key);
        var items = {};
        items[key] = value;
        callback(items);
    }

    /* Store data. */
    exports.setStorage = function(key, value) {
        return localStorage.setItem(key, value);
    }

    /* Remove data. */
    exports.removeStorage = function(key) {
        return localStorage.removeItem(key);
    }

    return exports;
});

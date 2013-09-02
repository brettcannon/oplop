'use strict';

window.oplop = window.oplop || {};
oplop.impl = {};

(function() {

/* Plain HTML implementation has no special implementation "stuff". */

/* Get storage data.
   Asynchronous to make Chrome happy. */
oplop.impl.getStorage = function(key, callback) {
    var value = localStorage.getItem(key);
    var items = {};
    items[key] = value;
    callback(items);
}

/* Store data. */
oplop.impl.setStorage = function(key, value) {
    return localStorage.setItem(key, value);
}

/* Remove data. */
oplop.impl.removeStorage = function(key) {
    return localStorage.removeItem(key);
}

})();

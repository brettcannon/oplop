'use strict';

/* Plain HTML implementation has no special implementation "stuff". */

/* Get storage data.
   Asynchronous to make Chrome happy. */
function getStorage(key, callback) {
    var value = localStorage.getItem(key);
    var items = {};
    items[key] = value;
    callback(items);
}

/* Store data. */
function setStorage(key, value) {
    return localStorage.setItem(key, value);
}

/* Remove data. */
function removeStorage(key) {
    return localStorage.removeItem(key);
}

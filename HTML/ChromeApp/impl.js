'use strict';

window.oplop = window.oplop || {};
oplop.impl = {};

(function() {

oplop.impl.clipboardWrite = function() {
    return document.execCommand('copy');
}

oplop.impl.getStorage = function(key, callback) {
    chrome.storage.sync.get(key, callback);
}

oplop.impl.setStorage = function(key, value) {
    var items = {};
    items[key] = value;
    chrome.storage.sync.set(items);
}

oplop.impl.removeStorage = function(key) {
    chrome.storage.sync.remove(key);
}

})();

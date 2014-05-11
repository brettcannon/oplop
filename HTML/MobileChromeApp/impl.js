'use strict';

define('oplop/impl', [], function() {
    var exports = {};

    exports.clipboardWrite = function(text) {
        cordova.plugins.clipboard.copy(text);
        return true;
    }

    exports.getStorage = function(key, callback) {
        chrome.storage.sync.get(key, callback);
    }

    exports.setStorage = function(key, value) {
        var items = {};
        items[key] = value;
        chrome.storage.sync.set(items);
    }

    exports.removeStorage = function(key) {
        chrome.storage.sync.remove(key);
}

return exports;
});

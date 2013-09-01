function clipboardWrite() {
    return document.execCommand('copy');
}

function getStorage(key, callback) {
    chrome.storage.sync.get(key, callback);
}

function setStorage(key, value) {
    var items = {};
    items[key] = value;
    chrome.storage.sync.set(items);
}

function removeStorage(key) {
    chrome.storage.sync.remove(key);
}

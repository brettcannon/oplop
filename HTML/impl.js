/* Plain HTML implementation has no special implementation "stuff". */

function getStorage(key) {
    return localStorage.getItem(key);
}

function setStorage(key, value) {
    return localStorage.setItem(key, value);
}

function removeStorage(key) {
    return localStorage.removeItem(key);
}

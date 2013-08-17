window['goog'] = window['goog'] || {};
window['goog'].provide = window['goog'].provide ||
                            function(ns) {window[ns] = {};};
window['goog'].require = window['goog'].require || function(ns) {};

goog.provide('oplop');

goog.require('md5');

/**
  Convert a Latin-1 string to UTF-8.

    @param {!string} text Latin-1 string.
    @return {!string} UTF-8 string.
    @private
*/
oplop.latin1_to_utf8_ = function latin1_to_utf8(text) {
    var converted = new Array();

    for (var x = 0; x < text.length; x += 1) {
        var code_point = text.charCodeAt(x);

        if (code_point < 128) {
            converted.push(String.fromCharCode(code_point));
        }
        else {
            var first = 0xc0 | code_point >> 6;
            var second = 0x80 | code_point & 0x3f;

            converted.push(String.fromCharCode(first, second));
        }
    }

    return converted.join('');
};

/**
  Create an account password.

    @param {!string} nickname Nickname.
    @param {!string} master Master password.
    @return {!string} Account password.
*/
oplop.accountPassword = function(nickname, master) {
    var length = 8;
    var utf8_master = oplop.latin1_to_utf8_(master);
    var utf8_nickname = oplop.latin1_to_utf8_(nickname);

    var created_password = md5.urlsafe_base64(utf8_master + utf8_nickname);

    var digit_regex = /\d+/;
    var digit_pos = created_password.search(digit_regex);

    if (digit_pos < 0) {  // No digit found.
        created_password = '1' + created_password;
    }
    else if (digit_pos >= length) {  // Digit outside of final password.
        var digit = created_password.match(digit_regex);
        created_password = digit + created_password;
    }

    return created_password.substring(0, length);
};

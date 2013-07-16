goog.provide('oplop.nicknames');


/**
    Return the JSON serialization of the nicknames.

    @return {string} Nicknames as JSON.
*/
oplop.nicknames.getAllAsJSON = function() {
    var nicknamesJSON = window.localStorage.getItem('nicknames');

    if (goog.isString(nicknamesJSON)) {
        return nicknamesJSON;
    }
    else if (goog.isNull(nicknamesJSON)) {
             return '{}';
    }
    else {
        throw 'nicknames should only contain a JSON-formatted string';
    }
};


/**
   Get the stored nicknames.

   @return {!Object} Nicknames object.
*/
oplop.nicknames.getAll = function() {
    var nicknames = window.JSON.parse(oplop.nicknames.getAllAsJSON());

    if (!goog.isObject(nicknames)) {
        throw 'improper JSON value in localStorage.nicknames';
    }

    return nicknames;
};


/**
  See if the specified nickname exists.

  @param {!string} nickname Nickname to check.
  @return {!boolean} Whether nickname exists.
*/
oplop.nicknames.contains = function(nickname) {
    return nickname in oplop.nicknames.getAll();
};


/**
   Store the nicknames object.

   @param {!Object} nicknames Nicknames object to save.
*/
oplop.nicknames.saveAll = function(nicknames) {
    if (goog.isNull(nicknames) || !goog.isObject(nicknames)) {
        throw 'improper object for setting nicknames';
    }

    window.localStorage.setItem('nicknames', window.JSON.stringify(nicknames));
    window.localStorage.setItem('dirty', 'true');
};


/**
    Save the specified nickname.

   @param {string} nickname Nickname to save.
*/
oplop.nicknames.save = function(nickname) {
    var nicknames = oplop.nicknames.getAll();

    nicknames[nickname] = null;
    oplop.nicknames.saveAll(nicknames);
};


/**
    Delete a nickname.

    @param {string} nickname Nickname to delete.
*/
oplop.nicknames.del = function(nickname) {
    var nicknames = oplop.nicknames.getAll();

    delete nicknames[nickname];
    oplop.nicknames.saveAll(nicknames);
};


/**
    Delete all nicknames.
*/
oplop.nicknames.delAll = function() {
    window.localStorage.removeItem('nicknames');
};

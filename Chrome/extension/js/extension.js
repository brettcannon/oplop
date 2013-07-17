goog.provide('oplop.ui.extension');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.ui.ac');
goog.require('oplop.nicknames');
goog.require('oplop.ui');



/**
    Return the password count of the associated page.

    @param {Object} tab Visible tab.
    @return {number} Number of passwords in the visible tab.
    @private
*/
oplop.ui.extension.passwordCount_ = function(tab) {
    var backgroundPage = chrome.extension.getBackgroundPage();
    return backgroundPage['passwordCount'][tab.id];

};


/**
    Wire up UI elements.
*/
oplop.ui.extension.onLoad = function() {
    var nicknames = oplop.nicknames.getAll();
    //var nicknameList = goog.dom.getElement('nicknameList');
    var nicknameArray = new Array();

    for (var nickname in nicknames) {
        /* TODO(HTML5) Use datalist instead of Closure for autocompletion
        var nicknameOption = goog.dom.createDom('option',
                                                {'value': nickname});
        /goog.dom.appendChild(nicknameList, nicknameOption); */

        nicknameArray.push(nickname);
    }

    oplop.ui.extension.AUTO_COMPLETE_ = new goog.ui.ac.createSimpleAutoComplete(
                                            nicknameArray,
                                            goog.dom.getElement('nickname'),
                                            false, false);

    goog.events.listen(goog.dom.getElement('masterPassword'),
                        goog.events.EventType.FOCUS,
                        oplop.ui.extension.masterPasswordSelected_);

    goog.events.listen(goog.dom.getElement('createAccountPassword'),
                        goog.events.EventType.CLICK,
                        oplop.ui.extension.createAccountPassword);

    var options_url = chrome.extension.getURL('options.html');
    var options_link = goog.dom.getElement('optionsLink');

    options_link.href = options_url;
    if (window.localStorage.getItem('dirty')) {
        options_link.style.color = 'red';
        options_link.innerText = 'Unsaved nicknames!';
    }

    var manifest_xhr = new XMLHttpRequest();

    manifest_xhr.onreadystatechange = function() {
        if (manifest_xhr.readyState === 4) {
            var manifest_json = manifest_xhr.responseText;
            var manifest_data = window.JSON.parse(manifest_json);
            var version = manifest_data.version;
            var date_array = version.split('.');
            var version_date = new Date(date_array[0], date_array[1] - 1,
                                        date_array[2]);
            var time_lapse = new Date() - version_date;
            var max_time_lapse = 7 * 24 * 60 * 60 * 1000;  // 7 days

            if (time_lapse < max_time_lapse) {
                var newReleaseItem = goog.dom.getElement('newReleaseItem');
                newReleaseItem.style.display = 'inline';

                var newReleaseLink = goog.dom.getFirstElementChild(
                        newReleaseItem);
                newReleaseLink.href = 'http://code.google.com/p/oplop/wiki/' +
                                       'ChromeExtensionReleaseNotes#' +
                                       version;
                newReleaseLink.innerText += ' (' + version + ')';
            }
        }
    };
    manifest_xhr.open('GET', chrome.extension.getURL('manifest.json'), true);
    manifest_xhr.send();

    oplop.ui.onLoad();
};

window.onload = oplop.ui.extension.onLoad;
goog.exportSymbol('oplop.ui.extension.onLoad', oplop.ui.extension.onLoad);

/**
    Event handler for when the master password field is selected.

    @private
*/
oplop.ui.extension.masterPasswordSelected_ = function() {
    var nickname = oplop.ui.nickname();

    if (!oplop.nicknames.contains(nickname)) {
        oplop.ui.displayValidateMasterPassword(false);
    }
};


/**
    Nickname auto-completion instance.

    @type {goog.ui.AutoComplete.Basic}
    @private
*/
oplop.ui.extension.AUTO_COMPLETE_ = null;

/**
    Handle the creation and use of the account password.
*/
oplop.ui.extension.createAccountPassword = function() {

    chrome.tabs.getSelected(null, function(tab) {
        /* Must be before the account password is created as it will be erased
           at that point. */
        var nickname = oplop.ui.nickname();
        var accountPassword = oplop.ui.createAccountPassword();

        if (accountPassword !== null) {
            if (oplop.ui.extension.passwordCount_(tab) <= 2) {
                chrome.tabs.sendRequest(tab.id,
                                        {'accountPassword': accountPassword});
                window.close();
            }
            else {
                var outputProps = {'id': 'accountPassword', 'size': 8,
                                    'value': accountPassword,
                                    'autocomplete': 'off'};
                var outputNode = goog.dom.createDom('input', outputProps);
                var hideSections = ['nicknameSection',
                                    'masterPasswordSection'];

                // TODO iter interface?
                for (var x = 0; x < hideSections.length; x += 1) {
                    var node = goog.dom.getElement(hideSections[x]);
                    node.style.display = 'none';
                }

                goog.dom.replaceNode(outputNode,
                                goog.dom.getElement('createAccountPassword'));
                outputNode.select();
            }

            if (!oplop.nicknames.contains(nickname)) {
                oplop.nicknames.save(nickname);
            }
        }
    });
};

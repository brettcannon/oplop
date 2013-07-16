goog.provide('oplop.ui');

goog.require('goog.debug.ErrorHandler');  // Silence Closure Compiler
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventHandler');  // Silence Closure Compiler
goog.require('goog.events.EventTarget');  // Silence Closure Compilter
goog.require('goog.events.EventType');
goog.require('oplop');


/**
    Display the master password validation field.

    @param {boolean=} focus Whether to change focus.
*/
oplop.ui.displayValidateMasterPassword = function(focus) {
    var newNickname = goog.dom.getElement('newNickname');

    if (newNickname) {
        newNickname.style.display = 'none';
    }

    var validateMasterPassword = goog.dom.getElement('validateMasterPassword');

    validateMasterPassword.style.display = 'inline';
    if (focus === undefined || focus) {
        validateMasterPassword.focus();
    }
};

/**
  Get the nickname.

  @return {string} Nickname.
*/
oplop.ui.nickname = function() {
    return goog.dom.getElement('nickname').value;
};


/**
  Set event listeners on common UI elements.
*/
oplop.ui.onLoad = function() {
    var isNewNicknameCheckbox = goog.dom.getElement('isNewNickname');

    if (isNewNicknameCheckbox) {
        goog.events.listen(isNewNicknameCheckbox, goog.events.EventType.CLICK,
                            oplop.ui.displayValidateMasterPassword);
    }
};


/**
  Create the account password, handling UI issues related to it.

  @return {?string} Account password or null on failure.
*/
oplop.ui.createAccountPassword = function() {
    if (!oplop.ui.validMasterPassword_()) {
        oplop.ui.resetMasterPassword_();
        return null;
    }
    else {
        var nickname = oplop.ui.nickname();
        var masterPassword = goog.dom.getElement('masterPassword').value;
        var accountPassword = oplop.accountPassword(nickname, masterPassword);

        oplop.ui.clearData_();

        var accountPasswordNode = goog.dom.getElement('accountPassword');
        var masterPasswordSection = goog.dom.
                                        getElement('masterPasswordSection');
        var header = goog.dom.getFirstElementChild(masterPasswordSection);
        // Master password validation may have previous failed.
        header.style.backgroundColor = 'PaleGreen';

        return accountPassword;
    }
};


/**
  Validate the master password.

  @return {boolean} Whether the master password is valid.
  @private
*/
oplop.ui.validMasterPassword_ = function() {
    var secondMasterPassword = goog.dom.getElement('validateMasterPassword');
    var display_status = secondMasterPassword.style.display;

    if (!display_status || display_status === 'none') {
        return true;
    }
    else {
        return (goog.dom.getElement('masterPassword').value ==
                secondMasterPassword.value);
    }
};


/**
  Reset the master password fields as if they do not equal each other.

  @private
*/
oplop.ui.resetMasterPassword_ = function() {
    var header = goog.dom.getElement('masterPasswordSection');
    var masterPassword = goog.dom.getElement('masterPassword');
    goog.dom.getElement('validateMasterPassword').value = '';
    goog.dom.getFirstElementChild(header).style.backgroundColor = 'red';

    masterPassword.value = '';
    masterPassword.focus();
};


/**
  Clear out user-critical data to prevent snooping.

  @private
*/
oplop.ui.clearData_ = function() {
    var inputTags = goog.dom.getElementsByTagNameAndClass('input');

    // TODO iter interface?
    for (var x = 0; x < inputTags.length; x += 1) {
        var tag = inputTags[x];
        if (tag.type == 'password' || tag.type == 'text') {
            tag.value = '';
        }
    }
};

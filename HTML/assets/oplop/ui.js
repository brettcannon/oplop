'use strict';

window.oplop = window.oplop || {};
oplop.ui = {};

(function() {

oplop.ui.nicknamesLinkKey = 'nicknames link';
oplop.ui.linkToNicknamesClass = 'linkToNicknames';


oplop.ui.setAccountPassword = function(field, pwd) {
    // If you don't reset the selection range then focus() grabs the
    // physical box.
    window.getSelection().removeAllRanges();
    field.val(pwd).focus().select();
}

/**
    Turn off auto-* features on iOS.

    The 'inputs' argument is expected to be a superset of 'passwords'.
*/
oplop.ui.disableIOSAutoStuff = function(inputs, passwords) {
    /* Turn off all automatic formatting stuff from iOS.
       Leave on auto-complete for nicknames only. */
    inputs.attr('autocapitalize', 'off').attr('autocorrect', 'off');
    passwords.attr('autocomplete', 'off');
}

oplop.ui.displayValidateMasterPassword = function(event) {
    var checkbox = event.data.checkbox;
    var passwordField = event.data.passwordField;

    checkbox.css('display', 'none');
    passwordField.css('display', 'inline').focus();
}

oplop.ui.validateMasterPassword = function(firstPassword, secondPassword) {
    if (firstPassword.val() === secondPassword.val()) {
        return true;
    } else {
        firstPassword.val('');
        secondPassword.val('');
        firstPassword.focus();
        return false;
    }
}

oplop.ui.createAccountPassword = function(event, suppressPageChange) {
    var nickname = event.data.nickname;
    var newNickname = event.data.newNickname[0].checked;
    var masterPassword = event.data.masterPassword;
    var masterPasswordAgain = event.data.masterPasswordAgain;
    var accountPasswordField = event.data.accountPasswordField;

    if (newNickname) {
        var check = oplop.ui.validateMasterPassword(masterPassword,
                                                    masterPasswordAgain);
        if (!check) {
            return;
        }
    }

    if (!suppressPageChange) {
        $.mobile.changePage('#accountPasswordPage',
                                 {changeHash: false});
    }

    var accountPassword = oplop.algorithm.accountPassword(
            nickname.val(), masterPassword.val());
    $(':password, :text').val('');

    oplop.ui.setAccountPassword(accountPasswordField, accountPassword);
    if (oplop.impl.clipboardWrite !== undefined) {
        if (oplop.impl.clipboardWrite(accountPassword)) {
            setAccountPassword(accountPasswordField,
                               '... has been copied to your clipboard');
        }
    }
}

oplop.ui.startOver = function(event) {
    event.data.location = event.data.location;
}

/* Create/set the href to nicknames. */
oplop.ui.setNicknamesLink = function(href) {
    $('span.'+oplop.ui.linkToNicknamesClass).removeClass(oplop.ui.linkToNicknamesClass)
            .wrap('<a data-role=none class="' + oplop.ui.linkToNicknamesClass +
                  '" target="_blank"></a>');
    $('a.'+oplop.ui.linkToNicknamesClass).attr('href', href);
}

oplop.ui.changedNicknamesLink = function(event) {
        var href = event.target.value;
        if (href == '') {
            oplop.impl.removeStorage(oplop.ui.nicknamesLinkKey);
        } else {
            oplop.impl.setStorage(oplop.ui.nicknamesLinkKey, href);
        }
        oplop.ui.setNicknamesLink(href);
}

})();

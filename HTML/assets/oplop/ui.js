'use strict';

define('oplop/ui', ['jquery', 'oplop/algorithm', 'oplop/impl'],
       function($, algorithm, impl) {

    var exports = {};

    exports.nicknamesLinkKey = 'nicknames link';
    exports.linkToNicknamesClass = 'linkToNicknames';


    exports.setAccountPassword = function(field, pwd) {
        // If you don't reset the selection range then focus() grabs the
        // physical box.
        window.getSelection().removeAllRanges();
        field.val(pwd).focus().select();
    }

    /**
        Turn off auto-* features on iOS.

        The 'inputs' argument is expected to be a superset of 'passwords'.
    */
    exports.disableIOSAutoStuff = function(inputs, passwords) {
        /* Turn off all automatic formatting stuff from iOS.
           Leave on auto-complete for nicknames only. */
        inputs.attr('autocapitalize', 'off').attr('autocorrect', 'off');
        passwords.attr('autocomplete', 'off');
    }

    exports.displayValidateMasterPassword = function(event) {
        var checkbox = event.data.checkbox;
        var passwordField = event.data.passwordField;

        checkbox.css('display', 'none');
        passwordField.css('display', 'inline').focus();
    }

    exports.validateMasterPassword = function(firstPassword, secondPassword) {
        if (firstPassword.val() === secondPassword.val()) {
            return true;
        } else {
            firstPassword.val('');
            secondPassword.val('');
            firstPassword.focus();
            return false;
        }
    }

    exports.createAccountPassword = function(event, suppressPageChange) {
        var nickname = event.data.nickname;
        var newNickname = event.data.newNickname[0].checked;
        var masterPassword = event.data.masterPassword;
        var masterPasswordAgain = event.data.masterPasswordAgain;
        var accountPasswordField = event.data.accountPasswordField;

        if (newNickname) {
            var check = exports.validateMasterPassword(masterPassword,
                                                        masterPasswordAgain);
            if (!check) {
                return;
            }
        }

        if (!suppressPageChange) {
            $.mobile.changePage('#accountPasswordPage',
                                     {changeHash: false});
        }

        var accountPassword = algorithm.accountPassword(
                nickname.val(), masterPassword.val());
        $(':password, :text').val('');

        exports.setAccountPassword(accountPasswordField, accountPassword);
        if (impl.clipboardWrite !== undefined) {
            if (impl.clipboardWrite(accountPassword)) {
                exports.setAccountPassword(accountPasswordField,
                       '... has been copied to your clipboard');
            }
        }
    }

    exports.startOver = function(event) {
        event.data.location = event.data.location;
    }

    /* Create/set the href to nicknames. */
    exports.setNicknamesLink = function(href) {
        $('span.'+exports.linkToNicknamesClass).removeClass(exports.linkToNicknamesClass)
                .wrap('<a data-role=none class="' + exports.linkToNicknamesClass +
                      '" target="_blank"></a>');
        $('a.'+exports.linkToNicknamesClass).attr('href', href);
    }

    exports.changedNicknamesLink = function(event) {
            if (impl.setStorage == undefined) {
                alert('Implementation lacks ability to store settings!');
            }

            var href = event.target.value;
            if (href == '') {
                impl.removeStorage(exports.nicknamesLinkKey);
            } else {
                impl.setStorage(exports.nicknamesLinkKey, href);
            }
            exports.setNicknamesLink(href);
    }

    return exports;
});

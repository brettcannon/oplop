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

    exports.considerPasswordCopied = function(field, text) {
        field.attr('placeholder', text);
        field.val('');
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
                exports.considerPasswordCopied(accountPasswordField,
                       '... is in your clipboard');
            }
        }
    }

    /* Simulate reloading the page.

        Chrome apps can't simply re-assign window.location to do an actual
        reload, so do everything need to reset the page instead.
    */
    exports.startOver = function() {
        $(':password, :text').val('');
        $.mobile.changePage('#mainPage', {changeHash: false});
        $('#validateMasterPassword').css('display', 'none');
        $('#newNickname').prop('checked', false);
        ['ui-icon-checkbox', 'ui-checkbox'].forEach(function(value) {
            $('#newNicknameContainer .'+value+'-on').toggleClass(value+'-on')
                .toggleClass(value+'-off');
        });
        $('#newNicknameContainer').css('display', 'block');
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

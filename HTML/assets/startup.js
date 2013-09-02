$(function() {
    'use strict';

    /* For smooth transitions between screens, don't use any. */
    $.mobile.defaultPageTransition = 'none';

    oplop.ui.disableIOSAutoStuff($('input'), $('input[type="password"]'));

    /* When "New Nickname" checkbox is clicked ... */
    var newNicknameData = {checkbox: $('#newNicknameContainer'),
                           passwordField: $('#validateMasterPassword')};
    $('#newNickname').click(newNicknameData,
                            oplop.ui.displayValidateMasterPassword);

    /* When "Create account password" is clicked ... */
    var accountPasswordData = {nickname: $('#nickname'),
                               newNickname: $('#newNickname'),
                               masterPassword: $('#masterPassword'),
                               masterPasswordAgain: $('#validateMasterPassword'),
                               accountPasswordField: $('#accountPassword')};
    $('#createAccountPassword').click(accountPasswordData,
                                      oplop.ui.createAccountPassword);

    /* When "Start Over" is clicked ... */
    $('.startOver').click(window, oplop.ui.startOver);

    /* Pre-populate "Link to nickname". */
    oplop.impl.getStorage(oplop.ui.nicknamesLinkKey, function(items) {
        var href = items[oplop.ui.nicknamesLinkKey];
        if (href) {
            $('#nicknamesLink')[0].value = href;
            oplop.ui.setNicknamesLink(href);
    }
    });

    /* When something changes in "Link to nickname" ... */
    $('#nicknamesLink').change(oplop.ui.changedNicknamesLink);
});

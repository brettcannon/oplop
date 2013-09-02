$(function() {
    'use strict';

    /* For smooth transitions between screens, don't use any. */
    $.mobile.defaultPageTransition = 'none';

    disableIOSAutoStuff($('input'), $('input[type="password"]'));

    /* When "New Nickname" checkbox is clicked ... */
    var newNicknameData = {checkbox: $('#newNicknameContainer'),
                           passwordField: $('#validateMasterPassword')};
    $('#newNickname').click(newNicknameData, displayValidateMasterPassword);

    /* When "Create account password" is clicked ... */
    var accountPasswordData = {nickname: $('#nickname'),
                               newNickname: $('#newNickname'),
                               masterPassword: $('#masterPassword'),
                               masterPasswordAgain: $('#validateMasterPassword'),
                               accountPasswordField: $('#accountPassword')};
    $('#createAccountPassword').click(accountPasswordData,
                                      createAccountPassword);

    /* When "Start Over" is clicked ... */
    $('.startOver').click(window, startOver);

    /* Pre-populate "Link to nickname". */
    getStorage(nicknamesLinkKey, function(items) {
        var href = items[nicknamesLinkKey];
        if (href) {
            $('#nicknamesLink')[0].value = href;
            setNicknamesLink(href);
    }
    });

    /* When something changes in "Link to nickname" ... */
    $('#nicknamesLink').change(changedNicknamesLink);
});

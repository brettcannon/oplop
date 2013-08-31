$(function() {
    /* For smooth transitions between screens, don't use any. */
    $.mobile.defaultPageTransition = 'none';

    disableIOSAutoStuff();

    /* When "New Nickname" checkbox is clicked ... */
    $('#newNickname').click(displayValidateMasterPassword);

    /* When "Create account password" is clicked ... */
    $('#createAccountPassword').click(createAccountPassword);

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

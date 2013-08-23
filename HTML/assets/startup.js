function setAccountPassword(pwd) {
    // If you don't reset the selection range then focus() grabs the
    // physical box.
    window.getSelection().removeAllRanges();
    $('#accountPassword').val(pwd).focus().select();
}

$(function() {
    /* For smooth transitions between screens, don't use any. */
    $.mobile.defaultPageTransition = 'none';

    /* Turn off all automatic formatting stuff from iOS.
       Leave on auto-complete for nicknames only. */
    $('input').attr('autocapitalize', 'off').attr('autocorrect', 'off');
    $('input[type="password"]').attr('autocomplete', 'off');

    /* When "New Nickname" checkbox is clicked ... */
    $('#newNickname').click(function() {
        $('#newNicknameContainer').css('display', 'none');
        $('#validateMasterPassword').css('display', 'inline').focus();
    });

    /* When "Create account password" is clicked ... */
    $('#createAccountPassword').click(function() {
        if ($('#newNickname')[0].checked) {
            if ($('#masterPassword').val() !==
                    $('#validateMasterPassword').val()) {
                $('#masterPassword').val('');
                $('#validateMasterPassword').val('');
                $('#masterPassword').focus();
                return;
            }
        }

        $.mobile.changePage('#accountPasswordPage',
                                 {changeHash: false});

        var accountPassword = oplop.accountPassword($('#nickname').val(),
                                    $('#masterPassword').val());
        $(':password, :text').val('');

        setAccountPassword(accountPassword);
        if (window.clipboardWrite !== undefined) {
            clipboardWrite(accountPassword);
        }
    });

    /* When "Start Over" is clicked ... */
    $('.startOver').click(function() {
        window.location = window.location;
    });

    var nicknameLinkKey = 'nickname link';
    /* Pre-populate "Link to nickname". */
    $('#nicknameLink')[0].value = getStorage(nicknameLinkKey);

    /* When something changes in "Link to nickname" ... */
    $('#nicknameLink').change(function(event) {
        setStorage(nicknameLinkKey, event.target.value);
    });
});

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

    /* Create/set the href to nicknames. */
    function setNicknamesLink(href) {
        var linkToNicknamesClass = 'linkToNicknames';
        $('span.'+linkToNicknamesClass).removeClass(linkToNicknamesClass)
                .wrap('<a data-role=none class="' + linkToNicknamesClass + '" target="_blank"></a>');
        $('a.'+linkToNicknamesClass).attr('href', href);
    }

    var nicknamesLinkKey = 'nicknames link';
    /* Pre-populate "Link to nickname". */
    getStorage(nicknamesLinkKey, function(items) {
        var href = items[nicknamesLinkKey];
        if (href) {
            $('#nicknamesLink')[0].value = href;
            setNicknamesLink(href);
    }
    });


    /* When something changes in "Link to nickname" ... */
    $('#nicknamesLink').change(function(event) {
        var href = event.target.value;
        if (href == '') {
            removeStorage(nicknamesLinkKey);
        } else {
            setStorage(nicknamesLinkKey, href);
        }
        setNicknamesLink(href);
    });
});

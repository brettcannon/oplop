var nicknamesLinkKey = 'nicknames link';

function setAccountPassword(pwd) {
    // If you don't reset the selection range then focus() grabs the
    // physical box.
    window.getSelection().removeAllRanges();
    $('#accountPassword').val(pwd).focus().select();
}

function disableIOSAutoStuff() {
    /* Turn off all automatic formatting stuff from iOS.
       Leave on auto-complete for nicknames only. */
    $('input').attr('autocapitalize', 'off').attr('autocorrect', 'off');
    $('input[type="password"]').attr('autocomplete', 'off');
}

function displayValidateMasterPassword() {
    $('#newNicknameContainer').css('display', 'none');
    $('#validateMasterPassword').css('display', 'inline').focus();
}

function createAccountPassword() {
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
}

function startOver(event) {
    event.data.location = event.data.location;
}

/* Create/set the href to nicknames. */
function setNicknamesLink(href) {
    var linkToNicknamesClass = 'linkToNicknames';
    $('span.'+linkToNicknamesClass).removeClass(linkToNicknamesClass)
            .wrap('<a data-role=none class="' + linkToNicknamesClass + '" target="_blank"></a>');
    $('a.'+linkToNicknamesClass).attr('href', href);
}

function changedNicknamesLink(event) {
        var href = event.target.value;
        if (href == '') {
            removeStorage(nicknamesLinkKey);
        } else {
            setStorage(nicknamesLinkKey, href);
        }
        setNicknamesLink(href);
}

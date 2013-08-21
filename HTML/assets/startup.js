$(function() {
    $.mobile.defaultPageTransition = 'none';

    $('input').attr('autocapitalize', 'off').attr('autocorrect', 'off');
    $('input[type="password"]').attr('autocomplete', 'off');

    $('#newNickname').click(function() {
        $('#newNicknameContainer').css('display', 'none');
        $('#validateMasterPassword').css('display', 'inline').focus();
    });

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

        var setAccountPassword = function(pwd) {
            return $('#accountPassword').val(pwd).focus();
        }

        setAccountPassword(accountPassword).select();
        try {
            if (document.execCommand('copy')) {
                // Set to new text and select it so people can paste over it to see
                // what the account password was (if need be).
                setAccountPassword('... copied to clipboard').select();
            } else {
                window.getSelection().removeAllRanges();
                // Simply calling focus() select the physical input box.
                setAccountPassword(accountPassword);
            }
        }
        catch (e if e.name == 'NS_ERROR_FAILURE') {  // Firefox throws an exception.
            setAccountPassword(accountPassword);
        }
    });

    $('.startOver').click(function() {
        window.location = window.location;
    });
});

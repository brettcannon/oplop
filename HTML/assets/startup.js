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

        $('#accountPassword').val(accountPassword).focus();
    });

    $('.startOver').click(function() {
        window.location = window.location;
    });
});

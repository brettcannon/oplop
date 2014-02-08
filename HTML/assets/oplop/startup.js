'use strict';

define(['jquery', 'oplop/impl', 'oplop/ui'], function($, impl, ui) {
  $(function() {
    /* Duplicate the header. */
    var header = document.getElementsByTagName('header')[0].cloneNode(true);
    var accountPasswordPage = document.getElementById('accountPasswordPage');
    accountPasswordPage.insertBefore(header, accountPasswordPage.firstChild);

    /* For smooth transitions between screens, don't use any. */
    $.mobile.defaultPageTransition = 'none';

    /* When "New Nickname" checkbox is clicked ... */
    var newNicknameData = {checkbox: $('#newNicknameContainer'),
                           passwordField: $('#validateMasterPassword')};
    $('#newNickname').click(newNicknameData,
                            ui.displayValidateMasterPassword);

    /* When "Create account password" is clicked ... */
    var accountPasswordData = {nickname: $('#nickname'),
                               newNickname: $('#newNickname'),
                               masterPassword: $('#masterPassword'),
                               masterPasswordAgain: $('#validateMasterPassword'),
                               accountPasswordField: $('#accountPassword')};
    $('#createAccountPassword').click(accountPasswordData,
                                      ui.createAccountPassword);

    /* When "Start Over" is clicked ... */
    $('#startOver').click(window, ui.startOver);

    /* Pre-populate "Link to nickname". */
    if (impl.getStorage !== undefined) {
      impl.getStorage(ui.nicknamesLinkKey, function(items) {
          var href = items[ui.nicknamesLinkKey];
          if (href) {
              $('#nicknamesLink')[0].value = href;
              ui.setNicknamesLink(href);
        }
      });
    }

    /* When something changes in "Link to nickname" ... */
    $('#nicknamesLink').change(ui.changedNicknamesLink);
  });
});

goog.provide('oplop.ui.webapp');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('oplop');
goog.require('oplop.ui');


/**
    Wire up the UI.
*/
oplop.ui.webapp.onLoad = function() {

    goog.events.listen(goog.dom.getElement('createAccountPassword'), 'click',
                        oplop.ui.webapp.accountPassword_);

    oplop.ui.onLoad();
};

goog.exportSymbol('oplop.ui.webapp.onLoad', oplop.ui.webapp.onLoad);


/**
  @private
*/
oplop.ui.webapp.accountPassword_ = function() {
    var accountPassword = oplop.ui.createAccountPassword();

    if (accountPassword !== null) {
        var accountPasswordNode = goog.dom.getElement('accountPassword');

        accountPasswordNode.value = accountPassword;
        accountPasswordNode.select();
    }
};

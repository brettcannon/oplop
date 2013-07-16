function PasswordentryAssistant(nickname, isNew) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
    this.isNew = isNew;
    this.model = {
        nickname: nickname
    };

    this.enterKeyHandlerBound = this.enterKeyHandler.bind(this);
    this.submitBound = this.submit.bind(this);
}

PasswordentryAssistant.prototype.setup = function() {
    /* this function is for setup tasks that have to happen when the scene is first created */
            
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */

    /* setup widgets here */
    StageAssistant.setupMenu(this.controller);

    var passwordAttrs = {
        textFieldName: 'password',
        hintText: 'Enter Master Password',
        modelProperty: 'password',
        changeOnKeyPress: true
    };

    if (this.model.nickname) {
        passwordAttrs.autofocus = true;
        this.controller.get('nickname').innerHTML =
            this.model.nickname.escapeHTML();
        this.controller.setupWidget('nicknameEntry', {}, this.model);
        this.controller.get('nicknameEntry').style.display = 'none';
    }
    else {
        var nicknameAttrs = {
            textFieldName: 'nickname',
            hintText: 'Enter a Nickname',
            modelProperty: 'nickname',
            autofocus: true
        };
        this.controller.setupWidget('nicknameEntry', nicknameAttrs, this.model);
        this.controller.get('nickname').style.display = 'none';
    }

    this.controller.setupWidget(
        'password', passwordAttrs, this.model
    );

    var checkPasswordAttrs = {
        textFieldName: 'checkPassword',
        hintText: 'Verify Password',
        modelProperty: 'checkPassword',
        changeOnKeyPress: true
    };
    this.controller.setupWidget(
        'checkPassword', checkPasswordAttrs, this.model
    );
    if (!this.isNew) {
        this.controller.get('validateGroup').style.display = "none";
    }

    var submitAttrs = {
        label: "Generate Password"
    };
    this.controller.setupWidget('submitButton', submitAttrs, {});

    /* add event handlers to listen to events from widgets */
    this.controller.listen(
        this.controller.get('submitButton'),
        Mojo.Event.tap, 
        this.submitBound
    );
};

PasswordentryAssistant.prototype.submit = function(event) {
    if (this.isNew && this.model.password !== this.model.checkPassword) {
        Mojo.Log.info(this.model.password, " != ", this.model.checkPassword);
        this.controller.showAlertDialog({
            title: "Password verification failed!",
            message: "Entered passwords don't match!",
            choices:[
                {label:"Try again.", value: true, type: 'dismiss'}
            ],
            onChoose: this.resetPasswords.bind(this,false)
        });
    }
    else {
        this.generatePassword();
    }
};

PasswordentryAssistant.prototype.enterKeyHandler = function(event) {
    if (Mojo.Char.isEnterKey(event.keyCode)) {
        if (event.target === this.passwordInput) {
            if (!this.isNew) {
                this.submit();
            }
        }
        else if (event.target === this.checkPasswordInput) {
            this.submit();
        }
    }
};

PasswordentryAssistant.prototype.resetPasswords = function (event) {
    this.controller.get('password').mojo.setValue('');
    this.controller.get('checkPassword').mojo.setValue('');
    this.controller.get('password').mojo.focus();
};

PasswordentryAssistant.prototype.generatePassword = function (event) {
    var password = window.oplop.accountPassword(this.model.nickname, this.model.password);
    Mojo.Log.info("oplop(", this.model.nickname, ",", this.model.password, ") = ", password);
    if (this.isNew) {
        this.saveNickname();
    }
    this.controller.stageController.pushScene(
        'password', this.model.nickname, password
    );
};

PasswordentryAssistant.prototype.saveNickname = function () {
    NicknameDB.addNickname(this.model.nickname);
};

PasswordentryAssistant.prototype.activate = function() {
    /* put in event handlers here that should only be in effect when this scene is active. For
       example, key handlers that are observing the document */
    this.passwordInput =
        this.controller.get("password").getElementsByTagName("input")[0];
    this.checkPasswordInput =
        this.controller.get("checkPassword").getElementsByTagName("input")[0];

    this.controller.listen(
        this.controller.document,
        "keyup",
        this.enterKeyHandlerBound,
        true
    );
};

PasswordentryAssistant.prototype.deactivate = function(event) {
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
       this scene is popped or another scene is pushed on top */
    this.controller.stopListening(
        this.controller.document,
        "keyup",
        this.enterKeyHandlerBound,
        true
    );
};

PasswordentryAssistant.prototype.cleanup = function(event) {
    /* this function should do any cleanup needed before the scene is destroyed as 
       a result of being popped off the scene stack */
    this.controller.stopListening(
        this.controller.get('submitButton'),
        Mojo.Event.tap, 
        this.submitBound
    );
};

function MainAssistant() {
    /* this is the creator function for your scene assistant object. It will be passed all the 
       additional parameters (after the scene name) that were passed to pushScene. The reference
       to the scene controller (this.controller) has not be established yet, so any initialization
       that needs the scene controller should be done in the setup function below. */
    this.openDrawerHandlerBound = this.openDrawerHandler.bind(this);
    this.generatePasswordHandlerBound =
        this.generatePasswordHandler.bind(this);
    this.resetBound = this.reset.bind(this);
}

MainAssistant.prototype.setup = function() {
    /* this function is for setup tasks that have to happen when the scene is first created */
        
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    /* setup widgets here */
    StageAssistant.setupMenu(this.controller);

    this.drawerModel = {
        open: false
    };
    this.model = { };

    var nicknameAttrs = {
        textFieldName: 'nickname',
        hintText: 'Enter a Nickname',
        modelProperty: 'nickname',
        autoFocus: true
    };
    this.controller.setupWidget('nickname', nicknameAttrs, this.model);

    var drawerAttrs = { };
    this.controller.setupWidget('passwordDrawer', drawerAttrs, this.drawerModel);

    var passwordAttrs = {
        textFieldName: 'password',
        hintText: 'Enter Master Password',
        modelProperty: 'password'
    };
    this.controller.setupWidget('password', passwordAttrs, this.model);

    var validateAttrs = {
        label: "Validate Password?"
    };
    this.controller.setupWidget('validateButton', validateAttrs, this.model);

    var checkPasswordAttrs = {
        textFieldName: 'checkPassword',
        hintText: 'Verify Password',
        modelProperty: 'checkPassword'
    };
    this.controller.setupWidget(
        'checkPassword', checkPasswordAttrs, this.model
    );

    var resetAttrs = {
        label: "Reset"
    };
    this.controller.setupWidget('resetButton', resetAttrs, this.model);

    /* add event handlers to listen to events from widgets */
    this.controller.listen(
        this.controller.get('validateButton'),
        Mojo.Event.tap, 
        this.openDrawerHandlerBound
    );

    this.controller.listen(
        this.controller.get('password'),
        Mojo.Event.propertyChange,
        this.generatePasswordHandlerBound
    );
    this.controller.listen(
        this.controller.get('checkPassword'),
        Mojo.Event.propertyChange,
        this.generatePasswordHandlerBound
    );

    this.controller.listen(
        this.controller.get('resetButton'),
        Mojo.Event.tap, 
        this.resetBound
    );
};

MainAssistant.prototype.reset = function() {
    this.clearGeneratedPassword();
    this.closeDrawer();
    this.model.nickname = null;
    this.model.password = null;
    this.model.checkPassword = null;
    this.controller.modelChanged(this.model);
    this.controller.get('password').mojo.focus();
};

MainAssistant.prototype.resetPasswords = function() {
    this.clearGeneratedPassword();
    this.model.password = null;
    this.model.checkPassword = null;
    this.controller.modelChanged(this.model);
    this.controller.get('password').mojo.focus();
}

MainAssistant.prototype.clearGeneratedPassword = function() {
    this.controller.get('accountPassword').innerHTML = '';
    this.controller.get('addedToClipboard').innerHTML = '';
};

MainAssistant.prototype.openDrawerHandler = function (event) {
    if (this.drawerModel.open) {
        this.closeDrawer();
    }
    else {
        this.openDrawer();
    }
}

MainAssistant.prototype.closeDrawer = function() {
    this.drawerModel.open = false;
    this.controller.modelChanged(this.drawerModel);
}

MainAssistant.prototype.openDrawer = function() {
    if (!this.drawerModel.open) {
        this.drawerModel.open = true;
        this.controller.modelChanged(this.drawerModel);

        this.clearGeneratedPassword();
        this.model.checkPassword = null;
        this.controller.modelChanged(this.model);
        this.controller.get('checkPassword').mojo.focus();
    }
};

MainAssistant.prototype.generatePasswordHandler = function (event) {
    if (this.drawerModel.open) {
        if (this.model.checkPassword == null) {
            // then the user just entered the password in the main box, and
            // we should wait until the user is done.
            this.controller.get('checkPassword').mojo.focus();
            return;
        }
        else if (this.model.password == null) {
            // then the user is doing things in a strange order,
            // we should wait until the user is done.
            this.controller.get('password').mojo.focus();
            return;
        }
        else if (this.model.password != this.model.checkPassword) {
            Mojo.Log.info(this.model.password, " != ", this.model.checkPassword);
            this.controller.showAlertDialog({
                title: "Password verification failed!",
                message: "Entered passwords don't match!",
                choices:[
                    {label:"Try again.", value: true, type: 'dismiss'}
                ],
                onChoose: this.resetPasswords.bind(this,false)
            });
            return;
        }
    }
    var password = window.oplop.accountPassword(this.model.nickname, this.model.password);
    Mojo.Log.info("oplop(", this.model.nickname, ",", this.model.password, ") = ", password);
    this.controller.get('accountPassword').innerHTML = password;
    if (this.addToClipboard(password)) {
        this.controller.get('addedToClipboard').innerHTML =
            'Successfully copied to clipboard.';
    }
    else {
        this.controller.get('addedToClipboard').innerHTML = '';
    }
    // on success, we should close the drawer
    this.drawerModel.open = false;
    this.controller.modelChanged(this.drawerModel);
};

MainAssistant.prototype.addToClipboard = function(data) {
    var appController = Mojo.Controller.getAppController();
    var stageController = appController.getActiveStageController();
    if (stageController != undefined) {
        stageController.setClipboard(data);
        return true;
    }
    return false;
};

MainAssistant.prototype.activate = function(event) {
    /* put in event handlers here that should only be in effect when this scene is active. For
       example, key handlers that are observing the document */
};

MainAssistant.prototype.deactivate = function(event) {
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
       this scene is popped or another scene is pushed on top */
};

MainAssistant.prototype.cleanup = function(event) {
    /* this function should do any cleanup needed before the scene is destroyed as 
       a result of being popped off the scene stack */
    this.controller.stopListening(
        this.controller.get('validateButton'),
        Mojo.Event.tap, 
        this.openDrawerHandlerBound
    );

    this.controller.stopListening(
        this.controller.get('password'),
        Mojo.Event.propertyChange,
        this.generatePasswordHandlerBound
    );
    this.controller.stopListening(
        this.controller.get('checkPassword'),
        Mojo.Event.propertyChange,
        this.generatePasswordHandlerBound
    );
    this.controller.stopListening(
        this.controller.get('resetButton'),
        Mojo.Event.tap, 
        this.resetBound
    );
};

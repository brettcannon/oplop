function PasswordAssistant(nickname, password) {
    /* this is the creator function for your scene assistant object. It will be passed all the 
       additional parameters (after the scene name) that were passed to pushScene. The reference
       to the scene controller (this.controller) has not be established yet, so any initialization
       that needs the scene controller should be done in the setup function below. */
    this.nickname = nickname;
    this.password = password;
    this.copiedToClipboard = false;

    this.resetBound = this.reset.bind(this);
}

PasswordAssistant.prototype.setup = function() {
    /* this function is for setup tasks that have to happen when the scene is first created */
            
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    /* setup widgets here */
    var resetAttrs = {
        label: "Start Over"
    };
    this.controller.setupWidget('resetButton', resetAttrs, {});

    this.controller.get('accountNickname').innerHTML = this.nickname.escapeHTML();
    this.controller.get('accountPassword').innerHTML = this.password.escapeHTML();

    /* add event handlers to listen to events from widgets */
    this.controller.listen(
        this.controller.get('resetButton'),
        Mojo.Event.tap, 
        this.resetBound
    );
};

PasswordAssistant.prototype.reset = function (event) {
    this.controller.stageController.popScenesTo('nicknamechooser', true);
};

PasswordAssistant.prototype.activate = function(event) {
    /* put in event handlers here that should only be in effect when this scene is active. For
       example, key handlers that are observing the document */
    if (!this.copiedToClipboard) {
        this.controller.stageController.setClipboard(this.password);
        this.copiedToClipboard = true;
    }
};

PasswordAssistant.prototype.deactivate = function(event) {
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
       this scene is popped or another scene is pushed on top */
};

PasswordAssistant.prototype.cleanup = function(event) {
    /* this function should do any cleanup needed before the scene is destroyed as 
       a result of being popped off the scene stack */
    this.controller.stopListening(
        this.controller.get('resetButton'),
        Mojo.Event.tap, 
        this.resetBound
    );
};

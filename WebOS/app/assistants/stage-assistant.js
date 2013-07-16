function StageAssistant() {
	/* this is the creator function for your stage assistant object */
}

StageAssistant.prototype.setup = function() {
    var prefs = (new Mojo.Model.Cookie('prefs')).get() || {};
    if (prefs.useOldInterface) {
        this.controller.pushScene("main");
    }
    else {
        this.controller.pushScene("nicknamechooser", prefs);
    }
};

StageAssistant.setupMenu = function(sceneController) {
    sceneController.setupWidget(
        Mojo.Menu.appMenu,
        { omitDefaultItems: true },
        {
            items: [
               { label: 'Preferences', command: 'prefs' },
               { label: 'Help', command: 'help' },
               { label: 'About', command: 'about' }
            ]
        }
    );
};

StageAssistant.prototype.handleCommand = function(event) {
    if(event.type == Mojo.Event.command) {
        switch(event.command) {
            case 'about':
                this.controller.pushAppSupportInfoScene();
                break;
            case 'prefs':
                this.controller.pushScene('preferences');
                break;
            case 'help':
                this.controller.pushScene('help', false);
                break;
        }
    }
}; 

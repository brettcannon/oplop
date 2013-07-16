function PreferencesAssistant() {
    /* this is the creator function for your scene assistant object. It will be passed all the 
       additional parameters (after the scene name) that were passed to pushScene. The reference
       to the scene controller (this.controller) has not be established yet, so any initialization
       that needs the scene controller should be done in the setup function below. */
    this.cookie = new Mojo.Model.Cookie('prefs');
    this.model = this.cookie.get();
    if (!this.model) {
        this.model = {
            useOldInterface: false
        };
        this.cookie.put(this.model);
    }
}

PreferencesAssistant.prototype.setup = function() {
    /* this function is for setup tasks that have to happen when the scene is first created */
            
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    /* setup widgets here */
    this.controller.setupWidget(
        'oldInterfaceToggle',
        {
            modelProperty: 'useOldInterface',
            disabledProperty: 'oldInterfaceToggleDisabled'
        },
        this.model
    );
    
    /* add event handlers to listen to events from widgets */
    Mojo.Event.listen(
        this.controller.get('oldInterfaceToggle'),
        Mojo.Event.propertyChange,
        this.handlePrefsChange.bind(this)
    );
};

PreferencesAssistant.prototype.handlePrefsChange = function(event) {
    this.cookie.put(this.model);
};

PreferencesAssistant.prototype.activate = function(event) {
    /* put in event handlers here that should only be in effect when this scene is active. For
       example, key handlers that are observing the document */
};

PreferencesAssistant.prototype.deactivate = function(event) {
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
       this scene is popped or another scene is pushed on top */
};

PreferencesAssistant.prototype.cleanup = function(event) {
    /* this function should do any cleanup needed before the scene is destroyed as 
       a result of being popped off the scene stack */
    Mojo.Event.stopListening(
        this.controller.get('oldInterfaceToggle'),
        Mojo.Event.propertyChange,
        this.handlePrefsChange.bind(this)
    );
};

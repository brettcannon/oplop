function NicknamechooserAssistant(prefs) {
    /* this is the creator function for your scene assistant object. It will be passed all the 
       additional parameters (after the scene name) that were passed to pushScene. The reference
       to the scene controller (this.controller) has not be established yet, so any initialization
       that needs the scene controller should be done in the setup function below. */
    if (!prefs.hasRunBefore) {
        prefs.hasRunBefore = true;
        (new Mojo.Model.Cookie('prefs')).put(prefs);
        this.showFirstRunHelp = true;
    }
    else {
        this.showFirstRunHelp = false;
    }

    this.filteredList = [];
    this.currentFilter = "";

    this.nicknameListAttributes =  {
        addItemLabel: "New Nickname ...",
        itemTemplate: "nicknamechooser/list-itemTemplate",
        filterFunction: this.nicknameFilter.bind(this),
        autoconfirmDelete: false,
        swipeToDelete: true
    };
    this.nicknameListModel = {
        disabled: false
    };

    // if the exact same argument isn't passed into the stopListening call as
    // to the listen call, then the stopListening call doesn't actually take
    // effect. So we need to save the bound version of our event handlers for
    // later.
    this.enterKeyHandlerBound = this.enterKeyHandler.bind(this);
    this.handleTapBound = this.handleTap.bind(this);
    this.handleAddBound = this.handleAdd.bind(this);
    this.handleDeleteBound = this.handleDelete.bind(this);
}

NicknamechooserAssistant.prototype.nicknameFilter = function(filterString, listWidget, offset, count) {
    Mojo.Log.info("nicknameFilter for [%s]", filterString);
    this.currentFilter = filterString;
    NicknameDB.getFilteredNicknames(
        filterString, offset, count,
        this.updateFilteredNicknames.bind(this, filterString, listWidget, offset)
    );
};

NicknamechooserAssistant.prototype.updateFilteredNicknames = function (filterString, listWidget, offset, filtered) {
    var items = filtered.map(
        function(x) { return { data: x } }
    );
    Mojo.Log.info("items: %o", items);
    listWidget.mojo.noticeUpdatedItems(offset, items);
    listWidget.mojo.setLength(items.length);
    listWidget.mojo.setCount(items.length);
    if (filterString) {
        if (items.length > 0) {
            listWidget.mojo.getNodeByIndex(0).addClassName("selected");
        }
        // else, I would like to highlight the add element, but don't
        // know how right now.
    }
    this.filteredList = filtered;
};

NicknamechooserAssistant.prototype.setup = function() {
    /* this function is for setup tasks that have to happen when the scene is first created */
            
    /* setup widgets here */
    StageAssistant.setupMenu(this.controller);

    this.controller.setupWidget(
        'nicknameList', this.nicknameListAttributes, this.nicknameListModel
    );
    Mojo.Log.info(
        "Setup labelList with %o and model %o",
        this.nicknameListAttributes,
        this.nicknameListModel
    );
    
    /* add event handlers to listen to events from widgets */
    this.controller.listen(
        this.controller.get("nicknameList"),
        Mojo.Event.listTap,
        this.handleTapBound
    );
    this.controller.listen(
        this.controller.get("nicknameList"),
        Mojo.Event.listAdd,
        this.handleAddBound
    );
    this.controller.listen(
        this.controller.get("nicknameList"),
        Mojo.Event.listDelete,
        this.handleDeleteBound
    );
};

NicknamechooserAssistant.prototype.handleTap = function(event) {
    var nickname = this.filteredList[event.index];
    Mojo.Log.info("Choose nickname: " + nickname);
    this.controller.stageController.pushScene('passwordentry', nickname, false);
};

NicknamechooserAssistant.prototype.handleAdd = function(event) {
    this.controller.stageController.pushScene('passwordentry', this.currentFilter, true);
};

NicknamechooserAssistant.prototype.enterKeyHandler = function(event) {
    if (Mojo.Char.isEnterKey(event.keyCode)) {
        if (this.currentFilter) {
            if (this.filteredList.length > 0) {
                this.controller.stageController.pushScene(
                    'passwordentry', this.filteredList[0], false
                );
            }
            else {
                this.controller.stageController.pushScene(
                    'passwordentry', this.currentFilter, true
                );
            }
        }
    }
};

NicknamechooserAssistant.prototype.handleDelete = function(event) {
    NicknameDB.deleteNickname(this.filteredList[event.index]);
    this.filteredList.splice(event.index, 1);
};

NicknamechooserAssistant.prototype.activate = function(reset) {
    /* put in event handlers here that should only be in effect when this scene is active. For
       example, key handlers that are observing the document */
    if (this.showFirstRunHelp) {
        this.showFirstRunHelp = false;
        this.controller.stageController.pushScene('help', true);
    }

    var nicknameList = this.controller.get('nicknameList');
    if (reset) {
        nicknameList.mojo.close();
        this.currentFilter = '';
    }
    this.nicknameFilter(this.currentFilter, nicknameList, 0, 50);

    this.controller.listen(
        this.controller.document,
        "keyup",
        this.enterKeyHandlerBound,
        true
    );
};

NicknamechooserAssistant.prototype.deactivate = function(event) {
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
       this scene is popped or another scene is pushed on top */
    this.controller.stopListening(
        this.controller.document,
        "keyup",
        this.enterKeyHandlerBound,
        true
    );
};

NicknamechooserAssistant.prototype.cleanup = function(event) {
    /* this function should do any cleanup needed before the scene is destroyed as 
       a result of being popped off the scene stack */
    this.controller.stopListening(
        this.controller.get("nicknameList"),
        Mojo.Event.listTap,
        this.handleTapBound
    );
    this.controller.stopListening(
        this.controller.get("nicknameList"),
        Mojo.Event.listAdd,
        this.handleAddBound
    );
    this.controller.stopListening(
        this.controller.get("nicknameList"),
        Mojo.Event.listDelete,
        this.handleDeleteBound
    );
};

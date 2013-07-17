/*
    TODO There is an issue of no way to notify the options page of new
        nicknames. Either a message needs to be sent or a port needs to be left
        open to notify the options view that the popup created a new nickname.
        Or simply don't worry about it as people will typically keep the
        options page closed.
*/
goog.provide('oplop.options');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.fx.DragDrop');
goog.require('goog.fx.DragDropGroup');
goog.require('goog.style');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Prompt');
goog.require('goog.ui.TabBar');
goog.require('oplop.nicknames');


/**
    Callback to wire up the options page.
*/
oplop.options.onLoad = function() {
    // Tab bar
    oplop.options.TAB_BAR_ = new goog.ui.TabBar();
    oplop.options.TAB_BAR_.decorate(goog.dom.getElement('tab_bar'));

    function selectTab(event) {
        goog.dom.getElement(event.target.getId() + '_content').
                style.display = 'block';
    }

    function unselectTab(event) {
        goog.dom.getElement(event.target.getId() + '_content').
                style.display = 'none';
    }

    goog.events.listen(oplop.options.TAB_BAR_,
                        goog.ui.Component.EventType.SELECT, selectTab);
    goog.events.listen(oplop.options.TAB_BAR_,
                        goog.ui.Component.EventType.UNSELECT, unselectTab);

    // Managing/saving
    oplop.options.DRAG_GROUP_ = new goog.fx.DragDropGroup();
    oplop.options.TRASHCAN_ = new goog.fx.DragDrop('trashcan');

    var nicknames = oplop.nicknames.getAll();

    for (var nickname in nicknames) {
        oplop.options.displayNickname_(nickname);
    }

    oplop.options.DRAG_GROUP_.addTarget(oplop.options.TRASHCAN_);

    oplop.options.DRAG_GROUP_.init();
    oplop.options.TRASHCAN_.init();

    var newNicknamePrompt = new goog.ui.Prompt('New Nickname',
                                        'What nickname would you like to add?',
                                        oplop.options.newNickname_);

    function displayPrompt() {
        newNicknamePrompt.setVisible(true);
    }

    function dragStart(event) {
        goog.style.setOpacity(event.dragSourceItem.element, 0.5);
    }

    function dragEnd(event) {
        goog.style.setOpacity(event.dragSourceItem.element, 1.0);
    }


    /* TODO Move to goog.events.listen() once proper support exists for
            drag-out in Closure. */
    var nicknameSaveDrag = goog.dom.getElement('nicknamesSaveDrag');
        nicknameSaveDrag.addEventListener('dragstart',
                                    oplop.options.saveNicknamesFile_, false);
        nicknameSaveDrag.addEventListener('dragend',
                                            oplop.options.nicknamesSaved_,
                                            false);

    goog.events.listen(goog.dom.getElement('newNicknamePrompt'),
                                            goog.events.EventType.CLICK,
                                            displayPrompt);

    goog.events.listen(oplop.options.DRAG_GROUP_, 'dragstart', dragStart);
    goog.events.listen(oplop.options.DRAG_GROUP_, 'dragend', dragEnd);

    goog.events.listen(oplop.options.TRASHCAN_, 'dragover',
                        oplop.options.overTrashcan_);
    goog.events.listen(oplop.options.TRASHCAN_, 'dragout',
                        oplop.options.offTrashcan_);
    goog.events.listen(oplop.options.TRASHCAN_, 'drop',
                        oplop.options.useTrashcan_);

    // Erasing/resetting
    goog.events.listen(goog.dom.getElement('eraseNicknames'),
                        goog.events.EventType.CLICK,
                        oplop.options.eraseNicknames_);

    goog.events.listen(goog.dom.getElement('nicknamesLoadDrop'),
                                            goog.events.EventType.CHANGE,
                                            oplop.options.loadNicknamesFile_);
};

window.onload = oplop.options.onLoad;
goog.exportSymbol('oplop.options.onLoad', oplop.options.onLoad);


/**
    Tab bar.

    @type {goog.ui.TabBar}
    @private
*/
oplop.options.TAB_BAR_ = null;

/**
   Keep the DragDropGroup for the displayed nicknames.

   @type {goog.fx.DragDropGroup}
   @private
*/
oplop.options.DRAG_GROUP_ = null;


/**
   Trashcan drop target.

   @type {goog.fx.DragDrop}
   @private
*/
oplop.options.TRASHCAN_ = null;


/**
   Search for a li node in the list of nicknames.

   @param {string} nickname Nickname to search for.
    @param {function(string, string): boolean} predicate Predicate test.
   @return {?Node} Found node (or null).
   @private
*/
oplop.options.findNicknameNode_ = function(nickname, predicate) {
    var nicknames = goog.dom.getElement('nicknames').childNodes;

    for (var x = 0; x < nicknames.length; x += 1) {
        var node = nicknames[x];

        if (!(node.nodeType === 1 && node.nodeName == 'LI')) {
            continue;
        }

        if (predicate(nickname, node.innerText)) {
            return node;
        }
    }

    return null;
};


/**
    Style the trashcan while being dragged over.

    @param {goog.events.Event} event dragOver event.
    @private
 */
oplop.options.overTrashcan_ = function(event) {
    event.dropTargetItem.element.style.border = '5px black dashed';
};

/**
    Set style of trashcan when not hovering.

    @param {goog.events.Event} event dragOff event.
    @private
 */
oplop.options.offTrashcan_ = function(event) {
    event.dropTargetItem.element.style.border = '2px black solid';
};


/**
   Delete the nickname dropped on the trashcan.

   @param {goog.events.Event} event Drop event.
   @private
*/
oplop.options.useTrashcan_ = function(event) {
    oplop.options.offTrashcan_(event);

    var nickname = event.dragSourceItem.data.nickname;
    var nicknames = goog.dom.getElement('nicknames').childNodes;

    function predicate(nick, given) {
        return (nick === given);
    }

    goog.dom.removeNode(oplop.options.findNicknameNode_(nickname, predicate));

    oplop.nicknames.del(nickname);
};


/**
   Event handler for when the nicknames file is dropped on the desktop.

   @param {Event} event Drag event.
   @private
*/
oplop.options.saveNicknamesFile_ = function(event) {
    var dragOutData = 'text/plain:oplop_nicknames.json:';
    var dataURL = 'data:text/plain;charset=utf-8,' +
                    escape(oplop.nicknames.getAllAsJSON());

    event.dataTransfer.setData('DownloadURL', dragOutData + dataURL);
};

/**
  Clear the dirty bit for nicknames when they have been saved.

  @param {Event} event dragstop event.
  @private
*/
oplop.options.nicknamesSaved_ = function(event) {
    if (event.dataTransfer.dropEffect === 'move') {
        window.localStorage.removeItem('dirty');
    }
};

/**
    Load a nicknames file.

    @param {Event} event onChange event.
    @private
*/
oplop.options.loadNicknamesFile_ = function(event) {
    if (event.target.files.length !== 1) {
        alert('You may only load one file.');
        return;
    }

    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function() {
        try {
            var newNicknames = window.JSON.parse(reader.result);
        }
        catch (exc) {
            alert('Invalid JSON data');
            return;
        }

        if (!goog.isObject(newNicknames)) {
            alert('JSON data must be an object');
            return;
        }

        oplop.nicknames.saveAll(newNicknames);

        goog.dom.removeChildren(goog.dom.getElement('nicknames'));

        for (var nickname in newNicknames) {
            oplop.options.displayNickname_(nickname);
        }

        oplop.options.TAB_BAR_.setSelectedTabIndex(0);
    }

    reader.readAsText(file);
};


/**
   Display a nickname in the page.

   Nicknames are listed in case-insensitive alphabetical order. This is to
   make it easier to search for a nickname even though case matters when
   creating an account password.

   @param {string} nickname Nickname to display.
   @private
*/
oplop.options.displayNickname_ = function(nickname) {
    var nicknamesNode = goog.dom.getElement('nicknames');
    var newNode = goog.dom.createDom('li');
    var lowerNickname = nickname.toLowerCase();

    newNode.innerText = nickname;

    function predicate(nick, given) {
        return (nick < given.toLowerCase());
    }

    var found = oplop.options.findNicknameNode_(lowerNickname, predicate);
    if (found !== null) {
        goog.dom.insertSiblingBefore(newNode, found);
    }
    else {
        goog.dom.appendChild(nicknamesNode, newNode);
    }

    oplop.options.DRAG_GROUP_.addItem(newNode, {'nickname': nickname});
};


/**
    Process a new nickname given through a prompt.

    @param {string} response New nickname.
   @private
*/
oplop.options.newNickname_ = function(response) {
    var nicknames = oplop.nicknames.getAll();

    if (response === null) {
        return;
    }
    else if (response in nicknames) {
        alert('Nickname already exists!');
        return;
    }

    oplop.nicknames.save(response);
    oplop.options.displayNickname_(response);
};


/**
    Erase all nicknames.

    @private
*/
oplop.options.eraseNicknames_ = function() {
    oplop.nicknames.delAll();
    goog.dom.removeChildren(goog.dom.getElement('nicknames'));
    oplop.options.TAB_BAR_.setSelectedTabIndex(0);
};

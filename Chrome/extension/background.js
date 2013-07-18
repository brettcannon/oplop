/* Kept global so popup.html can access the object through
  chrome.extension.getBackgroundPage(). */
var passwordCount = {};

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        /*
            Display the icon when the content script sends a message.

            The title is set to display how many password fields were found.
        */
        var tabId = sender.tab.id;
        var count = request.passwordCount;
        var titleDetails = {tabId: tabId,
                            title: count + " password field(s) found"};

        passwordCount[tabId] = count;
        chrome.pageAction.show(tabId);
        chrome.pageAction.setTitle(titleDetails);

        sendResponse();
    }
);

// Do not keep around info about closed tabs.
chrome.tabs.onRemoved.addListener(
    function(tabId) {
        delete passwordCount[tabId];
    }
);

var inputTags = document.getElementsByTagName('input');
var passwordFields = [];

// Count all password fields.
for (x in inputTags) {
    if (inputTags[x].type === 'password') {
        passwordFields.push(inputTags[x]);
    }
}

// If there is at least one password field, tell background.html.
if (passwordFields.length) {
    chrome.extension.sendRequest({'passwordCount': passwordFields.length});
}

// If there is one or two password fields then paste the account password in.
if (1 <= passwordFields.length && passwordFields.length <= 2) {
    chrome.extension.onRequest.addListener(
      function(request, sender, sendResponse) {
        for (x in passwordFields) {
            passwordFields[x].value = request['accountPassword'];
            passwordFields[x].style['background-color'] = 'PaleGreen';
        }

        sendResponse();
    }
);
}

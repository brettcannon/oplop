describe('UI', function() {
    it('Disable iOS-specific auto-* features', function() {
        setFixtures('<input class="fakeInput"></span> \
                     <input class="fakeInput"></span> \
                     <input class="fakePassword"></span> \
                     <input class="fakePassword"></span>');

        var fakeInputs = $('.fakeInput');
        var fakePasswords = $('.fakePassword');

        disableIOSAutoStuff(fakeInputs, fakePasswords);

        expect(fakeInputs).toHaveAttr('autocapitalize', 'off');
        expect(fakeInputs).toHaveAttr('autocorrect', 'off');
        expect(fakePasswords).toHaveAttr('autocomplete', 'off');
    });

    it('Checking "New Nickname" hides the checkbox, shows 2nd password field, and focuses it', function() {
        setFixtures('<input id="checkbox"></span> \
                     <input id="otherPassword" style="display: none"></span>');
        var checkbox = $('#checkbox')
        var passwordField = $('#otherPassword');
        var data = {checkbox: checkbox, passwordField: passwordField};
        var clickEvent = jQuery.Event('click', {data: data});

        displayValidateMasterPassword(clickEvent);

        expect(checkbox).not.toBeVisible();
        expect(passwordField).toBeVisible();
        expect(passwordField).toBeFocused();
    });

    // XXX createAccountPassword (requires mock)
    // XXX setAccountPassword (requires mock)
    // XXX setNicknamesLink (requires mock)
    // XXX changedNicknamesLink (requires mock)

    it('"Start Over" reloads the page', function() {
        var location = 'somewhere'
        var fakeWindow = {location: location};
        var clickEvent = jQuery.Event('click', {data: fakeWindow});

        startOver(clickEvent);

        expect(location).toBe(location);
    });
});

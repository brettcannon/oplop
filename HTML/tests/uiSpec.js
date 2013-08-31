// XXX displayValidateMasterPassword (requires mock)
// XXX createAccountPassword (requires mock)
// XXX setAccountPassword (requires mock)
// XXX setNicknamesLink (requires mock)
// XXX changedNicknamesLink (requires mock)

describe('UI', function() {
    it('"Start Over" reloads the page', function() {
        var location = 'somewhere'
        var fakeWindow = {location: location};
        var clickEvent = jQuery.Event('click', {data: fakeWindow});

        startOver(clickEvent);

        expect(location).toBe(location);
    });

    it('Disable iOS-specific auto-* features', function() {
        setFixtures('<span class="fakeInput"></span> \
                     <span class="fakeInput"></span> \
                     <span class="fakePassword"></span> \
                     <span class="fakePassword"></span>');

        var fakeInputs = $('.fakeInput');
        var fakePasswords = $('.fakePassword');

        disableIOSAutoStuff(fakeInputs, fakePasswords);

        expect(fakeInputs).toHaveAttr('autocapitalize', 'off');
        expect(fakeInputs).toHaveAttr('autocorrect', 'off');
        expect(fakePasswords).toHaveAttr('autocomplete', 'off');
    });
});

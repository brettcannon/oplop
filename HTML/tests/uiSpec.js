// XXX setAccountPassword (requires mock)
// XXX disableIOSAutoStuff (requires mock)
// XXX displayValidateMasterPassword (requires mock)
// XXX createAccountPassword (requires mock)
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
});

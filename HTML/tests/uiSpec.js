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

    describe('"New Nickname"', function() {
        var checkbox;
        var passwordField;
        var clickEvent;

        beforeEach(function() {
            setFixtures('<input id="checkbox"></span> \
                         <input id="otherPassword" style="display: none"></span>');
            checkbox = $('#checkbox')
            passwordField = $('#otherPassword');
            var data = {checkbox: checkbox, passwordField: passwordField};
            clickEvent = jQuery.Event('click', {data: data});
        });

        it('hides the checkbox', function() {
            displayValidateMasterPassword(clickEvent);

            expect(checkbox).not.toBeVisible();
        });

        it('shows the 2nd password field and focuses it', function() {
            displayValidateMasterPassword(clickEvent);

            expect(passwordField).toBeVisible();
            expect(passwordField).toBeFocused();
        });
    });

    describe('Validate master password', function() {
        var firstField;
        var secondField;

        beforeEach(function() {
            setFixtures('<input id="firstField"></input> \
                         <input id ="secondField"></input>');
        firstField = $('#firstField');
        secondField = $('#secondField');
        });

        it('returns true if passwords match', function() {
            firstField.val('password');
            secondField.val('password');

            var given = validateMasterPassword(firstField, secondField);
            expect(given).toBeTruthy();
        });

        it('returns false if passwords differ', function() {
            firstField.val('password');
            secondField.val('pasword');

            var given = validateMasterPassword(firstField, secondField);
            expect(given).toBeFalsy();
        });

        it('blanks input fields and sets focus on first field', function() {
            firstField.val('password');
            secondField.val('pasword');

            validateMasterPassword(firstField, secondField);
            expect(firstField).toBeFocused();
            expect(firstField).toHaveValue('');
            expect(secondField).toHaveValue('');
        });
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

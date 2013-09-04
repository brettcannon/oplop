describe('UI', function() {
    it('Disable iOS-specific auto-* features', function() {
        setFixtures('<input class="fakeInput"></span> \
                     <input class="fakeInput"></span> \
                     <input class="fakePassword"></span> \
                     <input class="fakePassword"></span>');

        var fakeInputs = $('.fakeInput');
        var fakePasswords = $('.fakePassword');

        oplop.ui.disableIOSAutoStuff(fakeInputs, fakePasswords);

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
            oplop.ui.displayValidateMasterPassword(clickEvent);

            expect(checkbox).not.toBeVisible();
        });

        it('shows the 2nd password field and focuses it', function() {
            oplop.ui.displayValidateMasterPassword(clickEvent);

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

            var given = oplop.ui.validateMasterPassword(firstField, secondField);
            expect(given).toBeTruthy();
        });

        it('returns false if passwords differ', function() {
            firstField.val('password');
            secondField.val('pasword');

            var given = oplop.ui.validateMasterPassword(firstField, secondField);
            expect(given).toBeFalsy();
        });

        it('blanks input fields and sets focus on first field', function() {
            firstField.val('password');
            secondField.val('pasword');

            oplop.ui.validateMasterPassword(firstField, secondField);
            expect(firstField).toBeFocused();
            expect(firstField).toHaveValue('');
            expect(secondField).toHaveValue('');
        });
    });

    describe('Account password', function() {
        it('can be set', function() {
            setFixtures('<input id="accountPassword"></input>');
            var field = $('#accountPassword');

            oplop.ui.setAccountPassword(field, 'ABCD');

            expect(field).toHaveValue('ABCD');
            expect(field).toBeFocused();
        });
    });

    describe('Account password creation', function() {
        var nickname;
        var newNickname;
        var masterPassword;
        var masterPasswordAgain;
        var accountPassword;
        var testEvent;

        beforeEach(function() {
            setFixtures('<input id="nickname"></input> \
                         <input type="password" id="masterPassword"></input> \
                         <input type="checkbox" id="newNickname"></input> \
                         <input type="password" id="masterPasswordAgain"></input> \
                         <input id="accountPassword"></input>');
            nickname = $('#nickname');
            newNickname = $('#newNickname');
            masterPassword = $('#masterPassword');
            masterPasswordAgain = $('#masterPasswordAgain');
            accountPasswordField = $('#accountPassword');
            var testEventData = {
                nickname: nickname,
                newNickname: newNickname,
                masterPassword: masterPassword,
                masterPasswordAgain: masterPasswordAgain,
                accountPasswordField: accountPasswordField
            };
            testEvent = jQuery.Event('click', {data: testEventData});
        });

        afterEach(function() {
            oplop.impl.clipboardWrite = undefined;
        });

        it('blanks passwords on failure', function() {
            nickname.val('nickname');
            masterPassword.val('password');
            masterPasswordAgain.val('pasword');
            newNickname[0].checked = true;

            oplop.ui.createAccountPassword(testEvent, true);

            expect(masterPassword).toHaveValue('');
            expect(masterPasswordAgain).toHaveValue('');
            expect(accountPasswordField).toHaveValue('');
        });

        it('blanks all fields on success', function() {
            nickname.val('nickname');
            masterPassword.val('password');

            oplop.ui.createAccountPassword(testEvent, true);

            expect(masterPassword).toHaveValue('');
            expect(nickname).toHaveValue('');
        });

        it('sets the account password', function() {
            nickname.val('nickname');
            masterPassword.val('password');
            var accountPassword = oplop.algorithm.accountPassword(
                    'nickname', 'password');

            oplop.ui.createAccountPassword(testEvent, true);

            expect(accountPasswordField).toHaveValue(accountPassword);
        });

        it('writes to the clipboard is available', function() {
            oplop.impl.clipboardWrite = jasmine.createSpy('clipboardWrite');
            nickname.val('nickname');
            masterPassword.val('password');
            var accountPassword = oplop.algorithm.accountPassword(
                    'nickname', 'password');

            oplop.ui.createAccountPassword(testEvent, true);

            expect(oplop.impl.clipboardWrite).toHaveBeenCalled();
            expect(oplop.impl.clipboardWrite).toHaveBeenCalledWith(accountPassword);
        });
    });

    describe('"Start Over"', function() {
        it('reloads the page', function() {
            var location = 'somewhere'
            var fakeWindow = {location: location};
            var clickEvent = jQuery.Event('click', {data: fakeWindow});

            oplop.ui.startOver(clickEvent);

            expect(location).toBe(location);
        });
    });

    describe('Nicknames link', function() {
        it('creates/sets the links', function() {
            setFixtures('<span class="' + oplop.ui.linkToNicknamesClass +
                        '">link</span>');

            oplop.ui.setNicknamesLink('http://www.example.com');

            var links = $('a.' + oplop.ui.linkToNicknamesClass);
            expect(links).not.toBeEmpty();
            expect(links).toHaveAttr('href', 'http://www.example.com');

            oplop.ui.setNicknamesLink('http://2.example.com');

            expect(links).toHaveAttr('href', 'http://2.example.com');
        });

        it('stores the link', function() {
            var event = {};
            event.target = {};
            event.target.value = 'http://www.example.com';
            var spy = spyOn(oplop.impl, 'setStorage');

            oplop.ui.changedNicknamesLink(event);

            expect(spy).toHaveBeenCalledWith(oplop.ui.nicknamesLinkKey,
                                             'http://www.example.com');
        });

        it('deletes the storage when unset', function() {
            var event = {};
            event.target = {};
            event.target.value = '';
            var setSpy = spyOn(oplop.impl, 'setStorage');
            var removeSpy = spyOn(oplop.impl, 'removeStorage');

            oplop.ui.changedNicknamesLink(event);

            expect(setSpy).not.toHaveBeenCalled();
            expect(removeSpy).toHaveBeenCalledWith(oplop.ui.nicknamesLinkKey);
        });
    });
});

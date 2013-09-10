define(['jasmine/jquery', 'jquery', 'oplop/ui', 'oplop/algorithm', 'oplop/impl'],
        function(jasmine, $, ui, algorithm, impl) {
    describe('UI', function() {
        it('Disable iOS-specific auto-* features', function() {
            setFixtures('<input class="fakeInput"></span> \
                         <input class="fakeInput"></span> \
                         <input class="fakePassword"></span> \
                         <input class="fakePassword"></span>');

            var fakeInputs = $('.fakeInput');
            var fakePasswords = $('.fakePassword');

            ui.disableIOSAutoStuff(fakeInputs, fakePasswords);

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
                ui.displayValidateMasterPassword(clickEvent);

                expect(checkbox).not.toBeVisible();
            });

            it('shows the 2nd password field and focuses it', function() {
                ui.displayValidateMasterPassword(clickEvent);

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

                var given = ui.validateMasterPassword(firstField, secondField);
                expect(given).toBeTruthy();
            });

            it('returns false if passwords differ', function() {
                firstField.val('password');
                secondField.val('pasword');

                var given = ui.validateMasterPassword(firstField, secondField);
                expect(given).toBeFalsy();
            });

            it('blanks input fields and sets focus on first field', function() {
                firstField.val('password');
                secondField.val('pasword');

                ui.validateMasterPassword(firstField, secondField);
                expect(firstField).toBeFocused();
                expect(firstField).toHaveValue('');
                expect(secondField).toHaveValue('');
            });
        });

        describe('Account password', function() {
            it('can be set', function() {
                setFixtures('<input id="accountPassword"></input>');
                var field = $('#accountPassword');

                ui.setAccountPassword(field, 'ABCD');

                expect(field).toHaveValue('ABCD');
                expect(field).toBeFocused();
            });
        });

        describe('Account password creation', function() {
            var nickname;
            var newNickname;
            var masterPassword;
            var masterPasswordAgain;
            var accountPasswordField;
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
                impl.clipboardWrite = undefined;
            });

            it('blanks passwords on failure', function() {
                nickname.val('nickname');
                masterPassword.val('password');
                masterPasswordAgain.val('pasword');
                newNickname[0].checked = true;

                ui.createAccountPassword(testEvent, true);

                expect(masterPassword).toHaveValue('');
                expect(masterPasswordAgain).toHaveValue('');
                expect(accountPasswordField).toHaveValue('');
            });

            it('blanks all fields on success', function() {
                nickname.val('nickname');
                masterPassword.val('password');

                ui.createAccountPassword(testEvent, true);

                expect(masterPassword).toHaveValue('');
                expect(nickname).toHaveValue('');
            });

            it('sets the account password', function() {
                nickname.val('nickname');
                masterPassword.val('password');
                var accountPassword = algorithm.accountPassword(
                        'nickname', 'password');

                ui.createAccountPassword(testEvent, true);

                expect(accountPasswordField).toHaveValue(accountPassword);
            });

            it('writes to the clipboard if available', function() {
                impl.clipboardWrite = jasmine.createSpy('clipboardWrite');
                impl.clipboardWrite.andReturn(true);
                nickname.val('nickname');
                masterPassword.val('password');
                var accountPassword = algorithm.accountPassword(
                        'nickname', 'password');

                ui.createAccountPassword(testEvent, true);

                expect(impl.clipboardWrite).toHaveBeenCalled();
                expect(impl.clipboardWrite).toHaveBeenCalledWith(accountPassword);
                expect(accountPasswordField).toHaveValue(
                        '... has been copied to your clipboard');
            });

            it('displays account password if clipboard failed', function() {
                impl.clipboardWrite = jasmine.createSpy('clipboardWrite');
                impl.clipboardWrite.andReturn(false);
                nickname.val('nickname');
                masterPassword.val('password');
                var accountPassword = algorithm.accountPassword(
                        'nickname', 'password');

                ui.createAccountPassword(testEvent, true);

                expect(impl.clipboardWrite).toHaveBeenCalled();
                expect(impl.clipboardWrite).toHaveBeenCalledWith(accountPassword);
                expect(accountPasswordField).toHaveValue(accountPassword);
            });
        });

        describe('"Start Over"', function() {
            it('reloads the page', function() {
                var location = 'somewhere'
                var fakeWindow = {location: location};
                var clickEvent = jQuery.Event('click', {data: fakeWindow});

                ui.startOver(clickEvent);

                expect(location).toBe(location);
            });
        });

        describe('Nicknames link', function() {
            it('creates/sets the links', function() {
                setFixtures('<span class="' + ui.linkToNicknamesClass +
                            '">link</span>');

                ui.setNicknamesLink('http://www.example.com');

                var links = $('a.' + ui.linkToNicknamesClass);
                expect(links).not.toBeEmpty();
                expect(links).toHaveAttr('href', 'http://www.example.com');

                ui.setNicknamesLink('http://2.example.com');

                expect(links).toHaveAttr('href', 'http://2.example.com');
            });

            it('stores the link', function() {
                var event = {};
                event.target = {};
                event.target.value = 'http://www.example.com';
                var spy = spyOn(impl, 'setStorage');

                ui.changedNicknamesLink(event);

                expect(spy).toHaveBeenCalledWith(ui.nicknamesLinkKey,
                                                 'http://www.example.com');
            });

            it('deletes the storage when unset', function() {
                var event = {};
                event.target = {};
                event.target.value = '';
                var setSpy = spyOn(impl, 'setStorage');
                var removeSpy = spyOn(impl, 'removeStorage');

                ui.changedNicknamesLink(event);

                expect(setSpy).not.toHaveBeenCalled();
                expect(removeSpy).toHaveBeenCalledWith(ui.nicknamesLinkKey);
            });
        });
    });
});

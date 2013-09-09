define(['jasmine', 'oplop/impl'], function(jasmine, impl) {
    describe('Storage implementation', function() {
        var key = 'test key';

        beforeEach(function () {
            impl.removeStorage(key);
        });

        it('can store and retrieve data', function() {
            var expected = {};
            expected[key] = 'ABCDEFG';

            impl.setStorage(key, expected[key]);
            impl.getStorage(key, function(given) {
                expect(given).toEqual(expected);
            });
        });

        it('supports deletion', function() {
            var value;
            impl.getStorage(key, function(given) {
                value = given;
            });
            expect(value[key]).toEqual();

            impl.setStorage(key, 'ABCD');
            impl.removeStorage(key);

            impl.getStorage(key, function(given) {
                expect(given[key]).toEqual(null);
            });
        });
    });
});

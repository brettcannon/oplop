describe('Storage implementation', function() {
    var key = 'test key';

    beforeEach(function () {
        oplop.impl.removeStorage(key);
    });

    it('can store and retrieve data', function() {
        var expected = {};
        expected[key] = 'ABCDEFG';

        oplop.impl.setStorage(key, expected[key]);
        oplop.impl.getStorage(key, function(given) {
            expect(given).toEqual(expected);
        });
    });

    it('supports deletion', function() {
        var value;
        oplop.impl.getStorage(key, function(given) {
            value = given;
        });
        expect(value[key]).toEqual();

        oplop.impl.setStorage(key, 'ABCD');
        oplop.impl.removeStorage(key);

        oplop.impl.getStorage(key, function(given) {
            expect(given[key]).toEqual(null);
        });
    });
});

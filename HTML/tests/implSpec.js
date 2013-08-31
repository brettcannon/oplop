describe('Storage implementation', function() {
    var key = 'test key';

    beforeEach(function () {
        removeStorage(key);
    });

    it('can store and retrieve data', function() {
        var expected = {};
        expected[key] = 'ABCDEFG';

        setStorage(key, expected[key]);
        getStorage(key, function(given) {
            expect(given).toEqual(expected);
        });
    });

    it('supports deletion', function() {
        var value;
        getStorage(key, function(given) {
            value = given;
        });
        expect(value[key]).toEqual();

        setStorage(key, 'ABCD');
        removeStorage(key);

        getStorage(key, function(given) {
            expect(given[key]).toEqual(null);
        });
    });
});

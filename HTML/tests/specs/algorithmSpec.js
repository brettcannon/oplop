describe('Algorithm', function() {

    // Inlined testdata.json as loading files dynamically
    // from file://localhost is blocked by same-origin.
    var testValues = [
        {
            "why": "label and master password are easy to type (i.e., short and the same)",
            "label": "a",
            "master": "a",
            "hash": "QSS8CpM1wn8IbyS6IHpJEg==",
            "password": "QSS8CpM1"
        },
        {
            "why": "hash has a digit in first 8 characters & label differs from master password",
            "label": "0",
            "master": "1",
            "hash": "09lEaAKkQll1XTjm0WPoIA==",
            "password": "09lEaAKk"
        },
        {
            "why": "hash has a sequence of digits outside of first 8 chars",
            "label": "0",
            "master": "9",
            "hash": "hhOYXsSeuPdXrmQ56Hm7Kg==",
            "password": "56hhOYXs"
        },
        {
            "why": "hash has a lone digit outside of first 8 chars",
            "label": "0",
            "master": "7",
            "hash": "fLvECeyZDxnHjHW9HgbyFQ==",
            "password": "9fLvECey"
        },
        {
            "why": "hash has no digits",
            "label": "0",
            "master": "0",
            "hash": "tLFHvFIoKHMfGgFr-nLAcw==",
            "password": "1tLFHvFI"
        },
        {
            "why": "master password w/ UTF-8 char",
            "label": "ü",
            "master": "0",
            "hash": "fHFfKQlvumngcWEWq7HCgg==",
            "password": "7fHFfKQl"
        },
        {
            "why": "mixed case, length greater than 1 for label and master",
            "label": "Aa",
            "master": "Bb",
            "hash": "pb3iGMs2S-VgWAX1kElklg==",
            "password": "pb3iGMs2"
        }
    ];

    testValues.forEach(function(value, index, array) {
        it(value.why, function() {
            accountPassword =
                    oplop.accountPassword(value.label,
                                          value.master);
            expect(accountPassword).toEqual(value.password);

        });
    });

});

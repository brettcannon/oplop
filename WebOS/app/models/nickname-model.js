NicknameDB = (function () {
    var failed = false,
        nicknameDB;
    (function () {
        var db = openDatabase('nicknameDB', '1', 'Oplop Nickname Database');
        if (db) {
            db.transaction(function (tx) {
                tx.executeSql(
                    "create table if not exists 'nicknames' (nickname text unique on conflict replace)",
                    [],
                    function (tx, results) {
                        Mojo.Log.info("Successfully created nicknames table.");
                        nicknameDB = db;
                    },
                    function (tx, error) {
                        Mojo.Log.error(
                            "Database operation failed %o", error.message
                        );
                        failed = true;
                    }
                );
            });
        }
        else {
            Mojo.Log.error("Failed to create database!");
            failed = true;
        }
    })();

    return {
        getFilteredNicknames: function getFilteredNicknames(filter, offset, count, callback) {
            if (!nicknameDB) getFilteredNicknames.delay(
                0.1, filter, offset, count, callback
            );
            if (failed) {
                callback([]);
            }
            else {
                nicknameDB.transaction(function (tx) {
                    tx.executeSql(
                        "select nickname from nicknames where nickname like ?" +
                        "escape '\\' order by nickname limit ? offset ?",
                        [
                            filter.replace(/([\\%_])/g, '\\$1') + '%',
                            count, offset
                        ],
                        function (tx, results) {
                            Mojo.Log.info(
                                "Query succeeded for (%o, %o, %o), with %o results",
                                filter, offset, count, results.rows.length
                            );
                            var data = [];
                            for (var i=0; i<results.rows.length; i++) {
                                Mojo.Log.info(
                                    "Got row for %o",
                                    results.rows.item(i).nickname
                                );
                                data.push(results.rows.item(i).nickname);
                            }
                            callback(data);
                        },
                        function (tx, error) {
                            Mojo.Log.error(
                                "Database operation failed: %s", error.message
                            );
                            callback([]);
                        }
                    );
                });
            }
        },
        addNickname: function addNickname(nickname) {
            if (failed) return;

            if (!nicknameDB) addNickname.delay(0.1, nickname);

            nicknameDB.transaction(function (tx) {
                tx.executeSql(
                    "insert into nicknames values (?)",
                    [ nickname ],
                    function (tx, results) {
                        Mojo.Log.info("Successfully added %s", nickname);
                    },
                    function (tx, error) {
                        Mojo.Log.error(
                            "Failed to add %s: %s", nickname, error.message
                        );
                    }
                );
            });
        },
        deleteNickname: function deleteNickname(nickname) {
            if (failed) return;

            if (!nicknameDB) deleteNickname.delay(0.1, nickname);

            nicknameDB.transaction(function (tx) {
                tx.executeSql(
                    "delete from nicknames where nickname = ?",
                    [ nickname ],
                    function (tx, results) {
                        Mojo.Log.info("Successfully deleted %s", nickname);
                    },
                    function (tx, error) {
                        Mojo.Log.error(
                            "Failed to delete %s: %s", nickname, error.message
                        );
                    }
                );
            });
        }
    }
})();

const mysql = require('mysql');
const helper = require('./helper.js');


module.exports = {
    addParent : function (connection, username, callback) {
        if (username === null) {
            return callback({message: helper.MISSING_USERNAME});
        }

        var queryString = 'SELECT user_id FROM users WHERE username = ?;';
        connection.query(queryString, username, function(err, rows) {
            if (err) {
                console.log(err);
                return callback({message: helper.FAIL});
            }
            if (rows.length < 1) {
                queryString  = 'INSERT INTO users SET ?';
                connection.query(queryString, [username, helper.USER_TYPE_PARENT], function(err, rows) {
                    if (err) {
                        console.log(err);
                        return callback({message: helper.FAIL});
                    }
                    return callback({message: helper.SUCCESS});
                });
            }
        });
    }
}

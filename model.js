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
    },


    insertImage : function (connection, user_id, image, callback) {
        if (user_id === null) {
            return callback({message: helper.MISSING_USER_ID});
        }

        var data = {
            image: image,
            user_id: user_id
        };
        var queryString = 'UPDATE users SET image = ? WHERE user_id = ?;';
        connection.query(queryString, [image, user_id], function(err, rows) {
            if (err) {
                console.log(err);
                return callback({message: helper.FAIL});
            }
            return callback({message: helper.SUCCESS});
        });
    },


    getImagesByUsername : function (connection, username, callback) {
        if (username === null) {
            return callback({
                message: helper.MISSING_USERNAME,
                images: null
            });
        }

        var queryString = 'SELECT * FROM users WHERE username = ?;';
        connection.query(queryString, username, function(err, rows) {
            if (err) {
                console.log(err);
                return callback({
                    message: helper.FAIL,
                    images: null
                });
            }

            res = [];
            for (var i = 0; i < rows.length; i++) {
                res.push(rows[i]);
            }
            return callback({
                message: helper.SUCCESS,
                images: res
            });
        });
    },


    getUserDataByUsername : function (connection, username, callback) {
        if (username === null) {
            return callback({
                message: helper.MISSING_USERNAME,
                user_id: null,
                user_type: null,
                name: null
            });
        }

        var queryString = 'SELECT user_id, user_type, name, FROM users WHERE username = ? ORDER BY user_id;';
        connection.query(queryString, username, function(err, rows) {
            if (err) {
                console.log(err);
                return callback({
                    message: helper.FAIL,
                    user_id: null,
                    user_type: null,
                    name: null
                });
            }

            res = [];
            for (var i = 0; i < rows.length; i++) {
                dic = {};
                dic['user_id'] = rows[0].user_id;
                dic['user_type'] = rows[0].user_type;
                dic['name'] = rows[0].name;
                res.push(dic);
            }

            return callback({
                message: helper.SUCCESS,
                result: res
            });
        });
    }
}

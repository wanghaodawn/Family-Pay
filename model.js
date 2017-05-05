const mysql = require('mysql');
const helper = require('./helper.js');


module.exports = {
    registerParent : function (connection, username, req, res, callback) {
        if (username === null) {
            return callback(req, res, {message: helper.MISSING_USERNAME});
        }

        var queryString = 'SELECT user_id FROM users WHERE username = ?;';
        connection.query(queryString, username, function(err, rows) {
            if (err) {
                console.log(err);
                return callback(req, res, {message: helper.FAIL});
            }
            if (rows.length < 1) {
                data = {
                    username: username,
                    user_type: helper.USER_TYPE_PARENT,
                    name: username,
                };
                queryString  = 'INSERT INTO users SET ?;';
                connection.query(queryString, data, function(err, rows) {
                    if (err) {
                        console.log(err);
                        return callback(req, res, {message: helper.FAIL});
                    }
                    return callback(req, res, {message: helper.SUCCESS});
                });
            } else {
                return callback(req, res, {message: helper.SUCCESS});
            }
        });
    },
    
    addChild : function (connection, child_name, username, one_time_quota, monthly_quota, req, res, callback) {

        if (child_name == null || username == null || monthly_quota == null || one_time_quota == null) {
            return callback(req, res, {message: helper.FAIL});
        }

        // TODO: Image?
        var queryString = 'SELECT user_id FROM users WHERE users.username = ? ;';
        connection.query(queryString, username, function(err, rows) {
            if (err) {
                console.log(err);
                return callback(req, res, {message: helper.FAIL});
            }

            if (rows.length == 0) {
                console.log('account username not exist');
                return callback(req, res, {message: helper.FAIL});
            }

            queryString = 'SELECT user_id FROM users WHERE users.username = ? AND users.name = ?;';
            connection.query(queryString, [username, child_name], function(err, rows) {
                if (err) {
                    console.log(err);
                    return callback(req, res, {message: helper.FAIL});
                }

                if (rows.length == 0) {
                    data = {
                        username: username,
                        user_type: helper.USER_TYPE_CHILD,
                        name: child_name,
                        one_time_quota: one_time_quota,
                        monthly_quota: monthly_quota
                    };
                    var queryString  = 'INSERT INTO users SET ?;';
                    connection.query(queryString, data, function(err, rows) {
                        if (err) {
                            console.log(err);
                            return callback(req, res, {message: helper.FAIL});
                        }
                        return callback(req, res, {message: helper.SUCCESS});
                    });
                } else {
                    console.log('duplicate childname for this account');
                    return callback(req, res, {message: helper.FAIL});
                }

            });
        });
    },

    addAdmin : function (connection, admin_name, username, req, res, callback) {
        if (admin_name == null || username == null) {
            return callback(req, res, {message: helper.FAIL});
        }

        // TODO: Image?
        var queryString = 'SELECT user_id FROM users WHERE users.username = ? ;';
        connection.query(queryString, username, function(err, rows) {
            if (err) {
                console.log(err);
                return callback(req, res, {message: helper.FAIL});
            }

            if (rows.length == 0) {
                console.log('account username not exist');
                return callback(req, res, {message: helper.FAIL});
            }

            queryString = 'SELECT user_id FROM users WHERE users.username = ? AND users.name = ?;';
            connection.query(queryString, [username, admin_name], function(err, rows) {
                if (err) {
                    console.log(err);
                    return callback(req, res, {message: helper.FAIL});
                }

                if (rows.length == 0) {
                    data = {
                        username: username,
                        user_type: helper.USER_TYPE_PARENT,
                        name: admin_name
                    };
                    var queryString  = 'INSERT INTO users SET ?;';
                    connection.query(queryString, data, function(err, rows) {
                        if (err) {
                            console.log(err);
                            return callback(req, res, {message: helper.FAIL});
                        }
                        return callback(req, res, {message: helper.SUCCESS});
                    });
                } else {
                    console.log('duplicate admin name for this account');
                    return callback(req, res, {message: helper.FAIL});
                }

            });
        });
    },

}

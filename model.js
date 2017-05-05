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
                    queryString  = 'INSERT INTO users SET ?;';
                    connection.query(queryString, data, function(err, rows) {
                        if (err) {
                            console.log(err);
                            return callback(req, res, {message: helper.FAIL});
                        }
                        queryString = 'SELECT LAST_INSERT_ID() AS id;';
                        connection.query(queryString, function(err, rows) {
                            return callback(req, res, {message: helper.SUCCESS}, rows[0].id);
                        });
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

                        queryString = 'SELECT LAST_INSERT_ID() AS id;';
                        connection.query(queryString, function(err, rows) {
                            return callback(req, res, {message: helper.SUCCESS}, rows[0].id);
                        });
                    });
                } else {
                    console.log('duplicate admin name for this account');
                    return callback(req, res, {message: helper.FAIL});
                }

            });
        });
    },

    manage : function (connection, username, target_name, one_time_quota, monthly_quota, req, res, callback) {
        if (username == null || target_name == null || one_time_quota == null || monthly_quota == null) {
            return callback(req, res, {message: helper.FAIL});
        }

        var queryString = "SELECT * FROM users WHERE username = ? and name = ? AND user_type = '" +
                            helper.USER_TYPE_CHILD + "';";
        connection.query(queryString, [username, target_name], function(err, rows) {
            if (err) {
                console.log(err);
                return callback(req, res, {message: helper.FAIL});
            }

            if (rows.length != 1) {
                return callback(req, res, {message: helper.FAIL});
            }

            queryString = 'UPDATE users SET one_time_quota = ?, monthly_quota = ? ' +
                            'WHERE username = ? AND name = ? ';
            connection.query(queryString, [one_time_quota, monthly_quota, username, target_name], function(err, rows) {
                if (err) {
                    console.log(err);
                    return callback(req, res, {message: helper.FAIL});
                }
                return callback(req, res, {message: helper.SUCCESS});

            });
        });
    },

    getFamilyPayments : function (connection, username, req, res, callback) {
        if (username === null) {
            return callback(req, res, {message: helper.MISSING_USERNAME});
        }

        var queryString = 'SELECT * FROM payments WHERE from_username = ? ORDER BY payment_time DESC;';
        connection.query(queryString, username, function(err, rows) {
            if (err) {
                console.log(err);
                return callback(req, res, {message: helper.FAIL});
            }

            return callback(req, res, {message: helper.SUCCESS}, rows);
        });
    },

    getOneUserPayments : function (connection, username, target_name, req, res, callback) {
        if (username === null || target_name == null) {
            return callback(req, res, {message: helper.MISSING_USERNAME});
        }

        var queryString = 'SELECT * FROM payments WHERE from_username = ? AND from_name = ? ORDER BY payment_time DESC;';
        connection.query(queryString, username, target_name, function(err, rows) {
            if (err) {
                console.log(err);
                return callback(req, res, {message: helper.FAIL});
            }

            return callback(req, res, {message: helper.SUCCESS}, rows);
        });
    },
    
    addPayment : function (connection, data, req, res, callback) {
        if (data.payment_id == null || data.payment_time == null ||
            data.amount == null || data.from_username == null ||
            data.from_name == null || data.to_username == null ||
            data.status == null) {

            return callback(req, res, {message: helper.MISSING_PAYMENT_DATA});
        }

        var queryString  = 'INSERT INTO payments SET ?;';
        data = {payment_id : data.payment_id, payment_time : data.payment_time,
                amount : data.amount, from_username : data.from_username,
                from_name : data.from_name, to_username : data.to_username,
                status : data.status};

        connection.query(queryString, data, function(err, rows) {
            if (err) {
                console.log(err);
                return callback(req, res, {message: helper.FAIL});
            }

            return callback(req, res,
                            {message: helper.SUCCESS, payment_id : data.payment_id,
                                        payment_time : data.payment_time, amount : data.amount,
                                        from_username : data.from_username, from_name : data.from_name,
                                        to_username : data.to_username, status : data.status
                            });
        });


    }
}

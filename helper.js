const fs = require('fs');

module.exports = {
    // Message to be sent to browser
    USER_TYPE_CHILD: 'child',
    USER_TYPE_PARENT: 'parent',
    SUCCESS: 'Success',
    FAIL: 'Database Failure',
    LOGIN_FAIL: 'Login Failure',
    MISSING_TOKEN: 'Missing Token',
    INVALID_TOKEN: 'Invalid Token',
    VALID_TOKEN: 'Valid Token',
    MISSING_USERNAME: 'Missing Username',
    MISSING_USER_TYPE: 'Missing user_type',
    MISSING_PASSWORD: 'Missing Password',
    MISSING_QUOTA_ONE_TIME: 'Missing One Time Quota',
    MISSING_QUOTA_MONTH: 'Missing Monthly Quota',
    READ_IMAGE_ERROR: 'Cannot read the image',
    ERROR: 'Error',
    MISSING_IMAGE: 'Missing Image',
    INVALID_USER_TYPE: 'Invalid user_type',
    NO_FACEPP_API_KEY_FOUNT: 'Cannot get the api key of face++',
    PAYMENT_PENDING: 'pending',
    PAYMENT_DONE: 'done',
    MISSING_PAYMENT_DATA: 'Missing Payment Data',
    PAYMENT_FAIL: 'Payment Fail',

    getFacePPAPIKey : function (callback) {
        fs.readFile('FACEPP_API_KEY.dat', 'utf8', function (err, data) {
          if (err) {
                console.log(err);
                return callback('Cannot find the API Key of Face++');
            }
            return callback(data);
        });
    }

}

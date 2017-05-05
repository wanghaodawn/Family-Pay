const fs = require('fs');
const request = require('request');

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
    MISSING_USER_ID: 'Missing User Id',
    INVALID_USER_TYPE: 'Invalid user_type',
    NO_FACEPP_API_KEY_FOUNT: 'Cannot get the api key of face++',
    NO_FACES_MATCHED: 'No Faces Matched',
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
    },

    getImageBase64 : function (username, user_type, user_id, callback) {
        var path = __dirname + '/user_faces';

        if (user_type === helper.USER_TYPE_CHILD) {
            path += '/child';
        } else if (user_type === helper.USER_TYPE_PARENT) {
            path += '/parent';
        } else {
            path += '/temp';
        }

        path += `/${username}_${user_id}.jpg`;

        if(!fs.existsSync(path)) {
            return callback({
                message: helper.READ_IMAGE_ERROR,
                image: null
            });
        }
        var base64Image = fs.readFileSync(path, 'base64');
        return callback({
            message: helper.SUCCESS,
            image: null
        });
    },


    getSimilarityOfTwoImages : function (api_key, api_secret, image1, image2, callback) {
        if (image1 === null || image2 === null) {
            return callback({
                message: 'Missing Image',
                result: null
            })
        }

        // console.log(image2);
        var postData = {
            api_key: api_key,
            api_secret: api_secret,
            image_base64_1: image1,
            image_base64_2: image2
        }
        // console.log(postData);

        var options = {
            method: 'POST',
            form: postData,
            json: true,
            url: 'https://api-us.faceplusplus.com/facepp/v3/compare',
        };
        // console.log(options);

        request(options, function (err, response, body) {
            if (err) {
                // console.error(err);
                return callback({
                    message: 'FAil in Face++ API',
                    result: response
                })
            }
            // console.log(response.body);
            console.log(response.statusCode);
            return callback({
                message: 'Success',
                response: response
            })
        });
    }
}

const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const request = require('request');
const cors = require('cors');

const model = require('./model.js');
const helper = require('./helper.js');
const fileUpload = require('express-fileupload');

const bodyParser = require('body-parser');

const ACCESS_TOKEN = '531c2321-bfa8-3431-822e-72bb39df933b';


// Configurate the connection to MySQL
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'apifest'
});
connection.connect();


var app = express();
const port = 3000;
// app.use('/public', express.static(path.join(__dirname + '/public')));

// Middleware
app.use((req, res, next) => {
  var now = new Date().toString();

  // Get ip address
  var ip = req.ip;
  if (ip.substr(0, 7) === "::ffff:") {
      ip = ip.substr(7)
    }
  var log = `FROM ${ip} ${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to file system');
    }
  });
  next();
});
app.use(fileUpload());
app.use(cors());


app.use(bodyParser.json({ limit: '4mb' }));     // allows app to read data from URLs (GET requests)
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/check_login/', (req, res) => {

    if (! ('token' in req.body)) {
        console.log('Token missing, should login normally with username and password');
        return res.send({
            message: helper.MISSING_TOKEN
        });
    }
    else {
        console.log('token exist locally: ' + req.body.token);
        var propertiesObject = {'page': 1, 'size': 10 };
        var findAllPaymentsUrl = 'https://nginx0.pncapix.com/paymentsandtransfers/v1.0.0/payment';
        var options = {
            method: 'GET',
            qs: propertiesObject,
            json: true,
            url: findAllPaymentsUrl,
            headers: {
                "Authorization": "Bearer " + ACCESS_TOKEN,
                'X-Authorization': req.body.token
            }
        };

        request(options, function (err, apiResonse, body) {
            if (err) {
                console.error('error calling get all payments api: ', err);
                throw err
            }

            var statusCode = apiResonse.statusCode;
            console.log('statusCode: ', statusCode);

            if (statusCode == 200 || statusCode == 201) {
                console.log('Token is valid, should scan face directly');
                return res.send({
                    message: helper.VALID_TOKEN
                });
            } else {
                console.log('Token is not valid, should login normally with username and password');
                return res.send({
                    message: helper.INVALID_TOKEN
                });
            }
        });
    }
});

// Get API Key for Face++
var api_key = '';
var api_secret = '';
helper.getFacePPAPIKey(function (result) {
    result = result.trim();
    api_key = result.split('\n')[0];
    api_secret = result.split('\n')[1];

    if (api_key === '' || api_secret === '') {
        console.log(helper.NO_FACEPP_API_KEY_FOUNT);
    } else {
        console.log("Found Face++ API KEY");
    }
});


app.post('/api/login/', (req, res) => {
    // check para exist
    if (! ('username' in req.body)) {
        return res.send({
            message: helper.MISSING_USERNAME
        });
    }

    if (! ('password' in req.body)) {
        return res.send({
            message: helper.MISSING_PASSWORD
        });
    }

    // console.log('receive login data: ' + req.body.username + " " + req.body.password);
    var postData = {
        username: req.body.username,
        password: req.body.password
    };

    var pncLoginUrl = 'https://nginx0.pncapix.com/security/v1.0.0/login';
    var options = {
        method: 'POST',
        body: postData,
        json: true,
        url: pncLoginUrl,
        headers: {
            "Authorization": "Bearer " + ACCESS_TOKEN
        }
    };

    request(options, function (err, apiResonse, body) {
        if (err) {
            console.error('error calling login api json: ', err);
            throw err
        }

        var statusCode = apiResonse.statusCode;
        console.log('statusCode: ', statusCode);

        if (statusCode == 200 || statusCode == 201) {
            console.log('Login successfully ' + apiResonse.body.token);

            // TODO: store new parent

            return res.send({
                message: helper.SUCCESS,
                token: apiResonse.body.token,
                username: req.body.username
            });
        } else {
            return res.send({
                message: helper.LOGIN_FAIL,
                token: "",
                username: ""
            });
        }
    });
});


// app.get('/', (req, res) => {
//     res.send('Hello Express!');
// });


app.get('/api/get_image/:username/:user_type/:user_id', (req, res) => {
    // console.log(req.params);
    if (!('username' in req.params)) {
        return res.send({
            message: helper.MISSING_USERNAME,
            image: null
        });
    }
    if (!('user_type' in req.params)) {
        return res.send({
            message: helper.MISSING_USER_TYPE,
            image: null
        });
    }
    if (!('user_id' in req.body)) {
        return res.send({
            message: helper.MISSING_USER_ID
        });
    }

    var username = req.params.username;
    var user_type = req.params.user_type;
    var user_id = req.params.user_id;

    helper.getImageBase64(username, user_type, user_id, function(result) {
        if (result.message !== helper.SUCCESS) {
            return res.send({
                message: helper.READ_IMAGE_ERROR,
                image: null
            });
        }

        return res.send({
            message: helper.SUCCESS,
            image: result.image
        });
    });
});


app.post('/api/insert_image', (req, res) => {
    if (!('username' in req.body)) {
        return res.send({
            message: helper.MISSING_USERNAME,
            username: null,
            user_type: null,
            user_id: null,
            name: null
        });
    }

    var username = req.body.username;
    var user_type = helper.USER_TYPE_PARENT;
    var data = req.files.name.data;
    var new_image = new Buffer(data).toString('base64');

    var path = __dirname + '/user_faces/parent';

    Model.getUserDataByUsername(connection, username, function(result) {
        if (result.message !== helper.SUCCESS) {
            return res.send({
                message: helper.FAIL,
                username: null,
                user_type: null,
                user_id: null,
                name: null
            });
        }

        var user_id = result[0].user_id;
        path += `/${username}_${user_id}.jpg`;

        fs.writeFileSync(path, new Buffer(new_image, 'base64'));
        return res.send({
            message: helper.SUCCESS,
            username: username,
            user_type: result[0].user,
            user_id: user_id,
            name: result[0].name
        });
    });
});


app.post('/api/compare_faces', (req, res) => {
    // console.log(req);
    // if (!('username' in req.body)) {
    //     return res.send({
    //         message: helper.MISSING_USERNAME,
    //         result: null
    //     });
    // }
    // if (!('image' in req.body)) {
    //     return res.send({
    //         message: helper.MISSING_USERNAME,
    //         result: null
    //     });
    // }
    // var username = req.body.username;
    // var username = 'wanghaodawn';
    // var new_image = req.body.image;
    // console.log(new_image);

    console.log(req.files);
    var data = req.files.name.data;
    var username = req.files.name.name;
    var new_image = new Buffer(data).toString('base64');
    // console.log(username);
    // console.log(new_image);

    // fs.writeFileSync("test1.jpg", new Buffer(new_image, 'base64'));

    // console.log(username);
    // var new_image = fs.readFileSync(req.body.image, 'base64');

    // helper.getSimilarityOfTwoImages(api_key, api_secret, new_image, new_image, function (result) {
    //     console.log(result.result);
    // });

    model.getFirstUserIdByUsername(connection, username, function(result) {
        if (result.message !== helper.SUCCESS) {
            return res.send({
                message: helper.FAIL,
                username: null,
                user_type: null,
                user_id: null,
                name: null
            });
        }

        var similarity = [];
        var maxSimilarity = 0.0;
        var maxIndex = 0;
        for (var i = 0; i < result.result.length; i++) {
            var user_type = result.result[i].user_type;
            var user_id = result.result[i].user_id;
            var name = result.result[i].name;
            var path = __dirname + `/user_faces/${user_type}/${username}_${user_id}.jpg`;

            var base64Image = fs.readFileSync(path, 'base64');
            helper.getSimilarityOfTwoImages(api_key, api_secret, new_image, base64Image, function (results) {
                if (results.response.statusCode !== 200) {
                    similarity.push(0);
                } else {
                    var confidence = results.response.confidence;
                    similarity.push[confidence];
                    if (confidence > maxSimilarity) {
                        maxIndex = i;
                        maxSimilarity = confidence;
                    }
                }
            });
        }

        if (maxSimilarity < 50) {
            return res.send({
                message: helper.NO_FACES_MATCHED,
                username: null,
                user_type: null,
                user_id: null,
                name: null
            });
        } else {
            return res.send({
                message: helper.SUCCESS,
                username: result[maxIndex].username,
                user_type: result[maxIndex].user_type,
                user_id: result[maxIndex].user_id,
                name: result[maxIndex].name
            });
        }
    });


    // model.getImagesByUsername(connection, username, function (result) {
    //     // console.log(result.images.length);
    //     if (result.message !== helper.SUCCESS) {
    //         return res.send({
    //             message: helper.FAIL,
    //             result: null
    //         });
    //     }
    //
    //     var images = result.images;
    //     var similarity = [];
    //     var itemProcesses = 0;
    //     images.forEach((item, index, array) => {
    //         // console.log(item);
    //         // console.log(item.length);
    //         var base64Image = fs.readFileSync('/Users/Dawn/Desktop/Git/Family-Pay/user_faces/parent/whdawn.jpg', 'base64');
    //         helper.getSimilarityOfTwoImages(api_key, api_secret, new_image, item, function (result) {
    //             // console.log(result.result);
    //         });
    //         itemProcesses++;
    //         if (itemProcesses === array.length) {
    //             return res.send({
    //                 message: helper.SUCCESS
    //             });
    //         }
    //     });
    // });
});


// app.post('/api/add_member/', (req, res) => {
//     // check para exist
//     if (! 'username' in req.body) {
//         return res.send({
//             message: helper.MISSING_USERNAME
//         });
//     }
//
//     if (! 'password' in req.body) {
//         return res.send({
//             message: helper.MISSING_PASSWORD
//         });
//     }
//
//     // console.log('receive login data: ' + req.body.username + " " + req.body.password);
//     var postData = {
//         username: req.body.username,
//         password: req.body.password
//     };
//
//     var pncLoginUrl = 'https://nginx0.pncapix.com/security/v1.0.0/login';
//     var options = {
//         method: 'POST',
//         body: postData,
//         json: true,
//         url: pncLoginUrl,
//         headers: {
//             "Authorization": "Bearer " + ACCESS_TOKEN
//         }
//     };
//
//     request(options, function (err, apiResonse, body) {
//         if (err) {
//             console.error('error calling login api json: ', err);
//             throw err
//         }
//
//         var statusCode = apiResonse.statusCode;
//         console.log('statusCode: ', statusCode);
//
//         if (statusCode == 200 || statusCode == 201) {
//             console.log('Login successfully ' + apiResonse.body.token);
//
//             // TODO: store new parent
//
//             res.send({
//                 message: helper.SUCCESS,
//                 token: apiResonse.body.token,
//                 username: req.body.username
//             });
//         } else {
//             res.send({
//                 message: helper.LOGIN_FAIL,
//                 token: "",
//                 username: ""
//             });
//         }
//     });
// });


app.listen(port);
console.log(`Starting server at localhost:${port}`);

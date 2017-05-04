const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const request = require('request');

const model = require('./model.js');
const helper = require('./helper.js');
const fileUpload = require('express-fileupload');


const request = require('request');
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


app.get('/api/get_image/:username/:user_type/:filename', (req, res) => {
    // console.log(req.params);
    if (!('username' in req.params)) {
        return res.send({
            message: helper.MISSING_USERNAME
        });
    }
    if (!('user_type' in req.params)) {
        return res.send({
            message: helper.MISSING_USER_TYPE
        });
    }

    var username = req.params.username;
    var user_type = req.params.user_type;
    var path = __dirname + '/user_faces';

    if (user_type === helper.USER_TYPE_CHILD) {
        path += '/child';
    } else if (user_type === helper.USER_TYPE_PARENT) {
        path += '/parent';
    } else {
        return res.send({
            message: helper.MISSING_USER_TYPE
        });
    }

    path += `/${username}.jpg`;
    console.log(path);
    fs.readFile(path, function(err, data) {
        if (err) {
            return res.send({
                message: helper.READ_IMAGE_ERROR
            });
        }
        res.setHeader('Content-Type', 'image/jpeg');
        res.set("Accept-Ranges","bytes");
        res.set("Content-Disposition", "attachment;filename=" + "username.jpg");
        // res.writeHead(200, {'Content-Type': 'multipart/form-data'});
        res.send(data);
    });
});


app.post('/api/compare_faces', (req, res) => {
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

    var url = 'https://api-us.faceplusplus.com/facepp/v3/compare';
    var image_url1 = 'http://10.141.95.142:3000/api/get_image?username=whdawn&user_type=parent&filename=whdawn.jpg';
    var image_url2 = 'http://10.141.95.142:3000/api/get_image?username=wanghaodawn&user_type=child&filename=wanghaodawn.jpg';
    var postData = {
        api_key: api_key,
        api_secret: api_secret,
        image_url1: image_url1,
        image_url2: image_url2
    }
    console.log(postData);

    var options = {
        method: 'POST',
        body: postData,
        json: true,
        url: url,
    };

    console.log(options);

    request(options, function (err, response, body) {
        if (err) {
            console.error(err);
            res.send({
                message: helper.FAIL
            })
        }
        console.log(response.body);
        console.log(response.statusCode);
        res.send({
            message: helper.SUCCESS
        })
    });
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

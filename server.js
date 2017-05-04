const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const request = require('request');

const model = require('./model.js');
const helper = require('./helper.js');
const fileUpload = require('express-fileupload');


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


app.listen(port);
console.log(`Starting server at localhost:${port}`);

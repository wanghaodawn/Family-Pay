const express = require('express');
const fs = require('fs');
const mysql = require('mysql');

const model = require('./model.js');
const helper = require('./helper.js');


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


app.get('/', (req, res) => {
    res.send('Hello Express!');
});


app.get('/api/get_image?', (req, res) => {
    if (!'username' in req.query) {
        return res.send({
            message: helper.MISSING_USERNAME
        });
    }
    if (!'user_type' in req.query) {
        return res.send({
            message: helper.MISSING_USER_TYPE
        });
    }

    var username = req.query.username;
    var user_type = req.query.user_type;
    var path = 'user_faces';

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
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.end(data);
    });
});



app.listen(port);
console.log(`Starting server at localhost:${port}`);

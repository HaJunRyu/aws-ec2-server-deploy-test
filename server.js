const express = require('express');
const app = express();

const fs = require('fs');
const formidable = require('formidable');

const mysql = require('mysql');
const dbconfig = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);

const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';

const s3 = new AWS.S3();

app.all('/', (req, res) => {
  res.send('connected aws ec2 server');
});

app.get('/login', (req, res) => {
  res.json({
    email: 'fbgkwns@gmail.com',
    nickname: '하준',
    profilePhoto: 'https://avatars.githubusercontent.com/u/71176945?v=4'
  });
});

app.set('port', process.env.PORT || 3002);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});

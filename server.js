const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors());

const fs = require('fs');
const formidable = require('formidable');

const mysql = require('mysql');
const dbconfig = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);

const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';

const s3 = new AWS.S3();

app.all('/', (req, res) => {
  res.send(`
  <html>
      <body>
        <form enctype="multipart/form-data" method="post" action="/signup">
          <input type="file" name="image"/><button type="submit">전송</button>
        </form>
      </body>
    </html>`);
});

// app.get('/login', (req, res) => {
//   connection.query('SELECT * from users', (error, rows) => {
//     if (error) throw error;
//     console.log('User info is: ', rows);
//     res.json(rows);
//   });
// });

app.post('/signup', (req, res) => {});

app.post('/image_upload', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    console.log(files.image);
    const params = {
      Bucket: 'aws-devfolio',
      Key: files.image.name,
      ACL: 'public-read',
      Body: require('fs').createReadStream(files.image.path)
    };
    s3.upload(params, (err, data) => {
      console.log(data);
      let result = '';
      if (err) result = 'Fail';
      else result = data.Location;
      res.send(result);
    });
  });
});

app.set('port', process.env.PORT || 3002);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});

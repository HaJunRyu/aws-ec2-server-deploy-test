const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors());

const {
  createUser,
  emailReduplicateValidation,
  nicknameReduplicateValidation,
  getUserPrimarykey
} = require('./dao/usersDAO');

const { getTils } = require('./dao/tilDAO');

const fs = require('fs');
const formidable = require('formidable');

const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';

const s3 = new AWS.S3();

app.post('/signin', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fileds, files) => {
    if (err) {
      res.send(err);
    }

    const loginUserInfo = await emailReduplicateValidation(fileds);

    if (!loginUserInfo) {
      // 요청받은 이메일에 해당하는 유저가 없을때 false값 응답
      res.send(false);
    } else {
      // 요청받은 이메일에 해당하는 유저가 있을때 유저 객체 응답
      res.send(loginUserInfo);
    }
  });
});

app.post('/signup', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fileds, files) => {
    if (err) {
      res.send(err);
    }

    const emailValidationResult = await emailReduplicateValidation(fileds);
    const nicknameValidationResult = await nicknameReduplicateValidation(fileds);

    if (emailValidationResult || nicknameValidationResult) {
      const reduplicate = {
        email: false,
        nickname: false
      };
      if (nicknameValidationResult) reduplicate.nickname = true;
      if (emailValidationResult) reduplicate.email = true;
      res.json(reduplicate);
    }

    console.log(await createUser(fileds));

    res.send({ complete: true });
  });
});

app.get('/tils/:nickname', async (req, res) => {
  const {
    params: { nickname }
  } = req;
  const rows = await getUserPrimarykey(nickname);
  if (rows) {
    const { idusers } = rows;
    const tils = await getTils(idusers);
    res.status(200).json(tils);
  } else {
    res.status(404).send('해당 닉네임이 존재하지 않습니다.');
  }
});

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
      else {
        result = JSON.stringify({
          src: data.Location,
          alt: data.Key
        });
      }
      res.send(result);
    });
  });
});

app.set('port', process.env.PORT || 3002);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});

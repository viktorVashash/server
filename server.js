var http = require('http');
var logger = require('morgan');
var bodyParser = require('body-parser');
var express = require('express');
var ig = require('instagram-node').instagram();
var app = express();
var redirect_uri = '';
var port = process.env.PORT || 8080;
var access_token = '';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
}

app.get('/user', function(req, res) {
  ig.use({
    client_id: '',
    client_secret: '',
    access_token: access_token
  });

  console.log(access_token);

  ig.user('self', function(err, result, remaining, limit) {
    res.send({data: result, token: access_token});
  });
});

app.get('/tags', function(req, res) {
  ig.tag_media_recent('', [], function(err, medias, aff, remaining, limit) {
    console.log(err);
  });
});

app.get('/authorize_user', function(req, res) {
  ig.use({
    client_id: '',
    client_secret: ''
  });

  res.send(ig.get_authorization_url(redirect_uri));
});

app.get('/handleauth', function(req, res) {
  ig.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      res.send(err.body);
    } else {
      access_token = result.access_token;
      res.redirect('vashash://');
    }
  });
});

http.createServer(app).listen(port, '0.0.0.0', function(err){
  if(err) {
    console.log(err);
  }

  console.log("Express server listening on port " + port);
});

var express = require('express');
var request = require('request');
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var path = require('path');

const PORT = process.env.PORT || 8888;

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
const hostname = process.env.ON_HEROKU
  ? `https://spotify-moodboard.herokuapp.com`
  : `http://localhost:${PORT}`;
const redirect_uri = hostname + '/callback';
var stateKey = 'spotify_auth_state';
var app = express();

app
  .use('/authorization', express.static(__dirname + '/public'))
  .use(express.static(path.join(__dirname, '../client/build')))
  .use(cors())
  .use(cookieParser());

app.get('/login', function (req, res) {
  const logout = req.url.includes('logout');
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  var scope =
    'user-read-private user-read-email user-library-read user-top-read user-library-modify';
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
        show_dialog: logout,
      })
  );
});

app.get('/callback', function (req, res) {
  // get refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      hostname +
        '/authorization/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(client_id + ':' + client_secret).toString('base64'),
      },
      json: true,
    };

    // get the tokens
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const tokensQuery = querystring.stringify({
          access_token: body.access_token,
          refresh_token: body.refresh_token,
        });

        const clientUrl = process.env.LOCAL_HEROKU
          ? 'http://localhost:5000'
          : process.env.ON_HEROKU
          ? 'https://spotify-moodboard.herokuapp.com'
          : 'http://localhost:3000';
        console.log('clientUrl', clientUrl);

        res.redirect(clientUrl + '?' + tokensQuery);
      } else {
        res.redirect(
          hostname +
            '/authorization/#' +
            querystring.stringify({
              error: 'invalid_token',
            })
        );
      }
    });
  }
});

app.get('/refresh_token', function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  console.log('refreshing token:' + req.query.refresh_token);
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(client_id + ':' + client_secret).toString('base64'),
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    } else {
      res
        .status(response.statusCode || error.statusCode)
        .send(error || response);
    }
  });
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

console.log(`Listening on ${PORT}`);
app.listen(PORT);

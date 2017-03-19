const express = require('express');
const multer = require('multer');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const calctimer = require('./biz/calculatetimer.js');
const utils = require('./utils');
const passport = require('passport');
const Strategy = require('passport-http').BasicStrategy;
const authentication = require('./biz/authentication.js');

const dblayer = require('./model');
const app = express();

const port = 8000;

const routes = require('./routes/index');
const voters = require('./routes/voters');
const candidates = require('./routes/candidates');
const elections = require('./routes/elections');

console.log(app.get('env'));
app.set('env', 'development');
console.log(app.get('env'));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(utils.requestTime);

// a middleware with no mount path; gets executed for every request to the app
app.use((req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  } catch (ex) {
    console.log(ex);
  }
  next();
});

// Configure the Basic strategy for use by Passport.
//
// The Basic strategy requires a `verify` function which receives the
// credentials (`username` and `password`) contained in the request.  The
// function must verify that the password is correct and then invoke `cb` with
// a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy(authentication.auth));

app.use('/', routes);
app.use('/voters', voters());
app.use('/candidates', candidates());
app.use('/elections', elections());
app.get('/users',
  passport.authenticate('basic', {session: false}),
  (req, res) => {
    res.json({id: req.user.id, username: req.user.username});
  });

const calculatetimer = new calctimer();
calculatetimer.startCalcInterval();

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500)
    .send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500)
  .send({
    message: err.message,
    error: {}
  });
});

app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app;

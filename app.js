var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); //Database
var passport = require('passport'); //For user login
var expressSession = require('express-session'); //For login session
var flash = require('connect-flash'); //For error messages
var connectMongo = require('connect-mongo'); //For persistent sessions
// var angular = require('angular');

var config = require('./config'); //Mongo config
var routes = require('./routes/index');
var users = require('./routes/users');
var beta = require('./routes/beta');

var MongoStore = connectMongo(expressSession);

var passportConfig = require('./auth/passport-config');
// var restrict = require('./auth/restrict');
passportConfig();

mongoose.set('debug', true);
console.log('mongoose debugging');
mongoose.connect(config.mongoUri);
// mongoose.connect("mongodb://localhost:27017/students");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession(
  {
    secret: 'class time',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  }
));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/beta', beta);
// app.use(restrict);
// app.use('/orders', orders);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// angular.module('app', ['angular-loading-bar']); 

module.exports = app;

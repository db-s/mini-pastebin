// mongoose config

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var engine = require('ejs-locals');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var pastes = require('./routes/pastes');

var app = express();

// Handling db errors
var dbErrorHandler = function(err, req, res, next) {
  res.status(500);
  res.render('error', {
    db: {
      msg: err.message,
      full_trace: err.errors.map(function(item) {
        return item.text.message;
      })
    }
  })
};

// Connect the database
mongoose.connect('mongodb://localhost/mini-pastebin');

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use session
app.use(session({
  secret: 'my secret'
}));
app.use(require('flash')());

// clearing flash messages
app.get('/*', function(req,res,next) {
  req.session.flash = [];
  next();
});

// routes
app.use('/', pastes);
app.use('/users', users);
app.use('/app', routes);

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
      title: 'Error',
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
    title: 'Error',
    message: err.message,
    error: {}
  });
});


module.exports = app;

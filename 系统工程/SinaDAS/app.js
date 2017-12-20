var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var logger = require('morgan');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var ejs = require('ejs');
var routes = require('./routes/index');
var session = require('express-session');
// var users = require('./routes/users');

var app = express();
app.use(session({ 
  secret: 'secret',
  cookie:{ 
    maxAge: 1000*60*30
  }
}));

app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use(cookieParser());

app.use('/', routes);
// app.use('/login', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(req,res,next){ 
  res.locals.user = req.session.user;
  var err = req.session.error;
  delete req.session.error;
  res.locals.message = "";
  if(err){ 
    res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
  }
  next();
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


module.exports = app;

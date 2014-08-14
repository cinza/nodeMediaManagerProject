var express = require('express');
var session = require('express-session');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
//global variables
var globalMediaManager = require('globalMediaManager');
//routes
var mediamanager = require('./routes/index');
var monitor = require('./routes/monitor');
var playlist = require('./routes/playlist');
var directory = require('./routes/directory');

var app = express();
var corsOptions = {
  origin: true,
  methods: ['GET'],
  credentials: true,
  maxAge: 3600
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);

app.use(session({secret: 'keyboard cat', saveUninitialized: true, resave: true}));
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.options('/play/:code', cors(corsOptions));

/// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

/// error handlers

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

//views
app.get('/', mediamanager.index);
app.post('/monitor', monitor.index);
app.post('/playlist', playlist.index);
app.get('/monitor/:id', monitor.getById);
app.post('/monitor/:id/disable', monitor.disable);
app.get('/playlist/:id', playlist.getById);
app.post('/playlist/:id/disable', playlist.disable);
app.delete('/playlist/:id', playlist.remove);
app.get('/play/:code', cors(corsOptions), directory.getFiles);
app.get('/play/:code/file/:name', directory.getFile);
//module.exports = app;

http.createServer(app).listen(app.get('port'), function(){
  console.log('Media Manager server listening on port ' + app.get('port'));
});

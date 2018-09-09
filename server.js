var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var debug = require('debug')('seagull');
var passport = require('passport');
var fs = require('fs');
var https = require('https');

var db = require('mongoose');
var config = require('./config/');
var routes = require('./routes/');
var cors = require('cors');

var app = express();
var privateKey  = fs.readFileSync(config.privateKeyPath, 'utf8');
var certificate = fs.readFileSync(config.certificatePath, 'utf8');
var credentials = {key: privateKey, cert: certificate};

app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


db.connect(config.db.uri, config.db.options);

db.connection.on('error', function (err) {
  debug('Connect to DB failed!');
  debug(err);
  process.exit(1);
});
db.connection.on('open', function () {
  debug('Connect to DB successful!');
});

// Init passport
app.use(passport.initialize());
require('./config/passport')(passport);

// Routes
app.use('/', routes);


app.all('/*', function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
  console.log('Not found error');
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.json({
    error: err.message,
    data: {},
  });
});


process.on('uncaughtException', function (error) {
  console.log(error.stack);
});

app.use('/public', express.static(path.join(__dirname + '/public')));

// Start the server
var httpsServer = https.createServer(credentials, app);

httpsServer.listen(8443);

httpsServer.on('error', onError);


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
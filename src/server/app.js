/*jshint node:true*/
'use strict';
var http = require('http')
  , url = require('url');
//  , httpProxy = require('http-proxy')
//  , proxy = httpProxy.createProxyServer({});

var server = http.createServer();

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server });

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var four0four = require('./utils/404')();
var cfg = require('./config');
var ot = require('ot');
var port = cfg.port;
var environment = cfg.env;

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger('dev'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-VNC-Auth");
  next();
});
app.use('/api', require('./routes'));

app.locals.cfg = cfg


console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment){
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function(req, res, next) {
            four0four.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** ' + environment + ' **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function(req, res, next) {
            four0four.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./src/client/index.html'));
        break;
}

// app.listen(port, function() {
//     console.log('Express server listening on port ' + port);
//     console.log('env = ' + app.get('env') +
//         '\n__dirname = ' + __dirname  +
//         '\nprocess.cwd = ' + process.cwd());
// });

wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});


server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });

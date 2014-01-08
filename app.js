
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var functionTest = require('./routes/functionTest');
var user = require('./routes/user');
var auth = require('./routes/auth');

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 1235);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('okura-cookie'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/function-test', functionTest.index);
app.get('/users', user.list);
app.get('/login', auth.login);
app.get('/callback', auth.callback, auth.loadUser);
app.get('/logout', auth.logout);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

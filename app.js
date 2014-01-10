
/**
 * Module dependencies.
 */
var config = require('./util/config').config;

var express = require('express');
var MongoStore = require('connect-mongo')(express);

var routes = require('./routes');
var functionTest = require('./routes/functionTest');

var auth = require('./routes/auth');
var user = require('./routes/user');
var item = require('./routes/item');
var upload = require('./routes/upload');

var adminApi = require('./routes/api/admin');
var itemApi = require('./routes/api/item');

var routerUtil = require('./routes/util');

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
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
    secret: config.core.sessionSecret,
    store: new MongoStore({
        db: config.database.session.db,
        host: config.database.session.host,
        username: config.database.session.username,
        password: config.database.session.password,
        clear_interval: 60 * 60
    }),
    cookie: {
        httpOnly: false,
        maxAge: null
    }
}));
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// page access
app.get('/', routes.index);
app.get('/function-test', functionTest.index);
app.get('/login', auth.login);
app.get('/callback', auth.callback, auth.loadUser);
app.get('/logout', auth.logout);

app.get('/mypage', routerUtil.mustLogin, user.itsme, user.detail);
app.get('/user', routerUtil.adminOnly, user.list);
app.get('/user/:twitterScreenName', user.detail);
app.get('/item/detail/:id', item.detail);
app.get('/upload', routerUtil.mustLogin, upload.index);
app.post('/upload/submit', routerUtil.mustLogin, upload.submit);
app.get('/raw/:id', item.raw);

// xhr access
app.get('/api/admin/user', routerUtil.adminOnly, adminApi.user.list);
app.get('/api/item/list', itemApi.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var config = require('../util/config').config.database.main;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = mongoose.connection;
db.on('error', function() {
    console.error('connection error');
});
db.once('open', function() {
    console.log('Connected okuradb');
});
mongoose.connect('mongodb://' + config.username + ':' + config.password + '@' + config.host + '/' + config.db);

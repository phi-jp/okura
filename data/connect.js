var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = mongoose.connection;
db.on('error', function() {
    console.error('connection error');
});
db.once('open', function() {
    console.log('Connected okuradb');
});
mongoose.connect('mongodb://localhost/okuradb');

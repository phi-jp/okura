require('./connect');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    twitterId: { type: String, required: true, unique: true },
    name: { type: String, requried: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    lastLoginedAt: { type: Date },
    admin: { type: Boolean, default: false }
});
UserSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

var User = exports.User = mongoose.model('User', UserSchema);

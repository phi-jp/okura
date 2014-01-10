require('./connect');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    twitterId: { type: String, required: true, unique: true },
    twitterScreenName: { type: String, requried: true, unique: true },
    name: { type: String, requried: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    lastLoginedAt: { type: Date },
    admin: { type: Boolean, default: false }
});
var User = mongoose.model('User', UserSchema);

User.prototype.toSessionObject = function() {
    return {
        id: this.id,
        twitterScreenName: this.twitterScreenName,
        name: this.name,
        admin: this.admin
    };
};

exports.User = User;

exports.create = function(data, callback) {
    console.log("create User twitterId:" + data.twitterId);
    data.createdAt = new Date();
    data.updatedAt = new Date();
    User.create(data, callback);
};

exports.update = function(data, callback) {
    console.log("update User twitterId:" + data.twitterId);
    data.updatedAt = new Date();
    if (data.save) {
        data.save(callback);
    } else {
        User.findByIdAndUpdate(data.id, data, {}, callback);
    }
};

exports.findByTwitterId = function(twitterId, callback) {
    User.findOne({ twitterId: twitterId }, callback);
};

exports.findByTwitterScreenName = function(twitterScreenName, callback) {
    User.findOne({ twitterScreenName: twitterScreenName }, callback);
};

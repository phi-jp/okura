require('./connect');
var mime = require('mime');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var kind = {
    IMAGE: 0,
    SOUND: 1,
    OTHER: 99
};

var getKind = function(fileName) {
    var type = mime.lookup(fileName);
    if (type.match(/^image\//)) return kind.IMAGE;
    else if (type.match(/^audio\//)) return kind.SOUND;
    return kind.OTHER;
};

var ItemSchema = new Schema({
    title: { type: String, requried: true },
    kind: { type: Number, requried: true, default: kind.OTHER },
    type: { type: String, requried: true, default: 'application/octet-stream' },
    fileName: { type: String, requried: true },
    owner: { type: String, requried: true },
    createdAt: { type: Date },
    updatedAt: { type: Date }
});
var Item = mongoose.model('Item', ItemSchema);

exports.kind = kind;

exports.newItem = function(fileName, user, callback) {
    console.log('create new item for fileName:' + fileName + ', user: ' + user.name);
    Item.create({
        title: fileName,
        kind: getKind(fileName),
        type: mime.lookup(fileName),
        fileName: fileName,
        owner: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    }, callback);
};

exports.findById = function(id, callback) {
    console.log('item findById id: ' + id);
    Item.findById(id, callback);
};

exports.count = function(where, callback) {
    Item.count(where).exec(callback);
};

exports.query = function(where, sort, page, callback) {
    console.log('item query');
    console.dir(where);
    Item
        .find(where)
        .limit(30)
        .skip(30 * page)
        .sort(sort)
        .exec(callback);
};

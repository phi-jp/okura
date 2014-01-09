require('./connect');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    title: { type: String, requried: true },
    kind: { type: Number },
    createdAt: { type: Date },
    updatedAt: { type: Date }
});
ItemSchema.pre('save', function(next) {
    console.log("save Item id:" + this.id);
    this.updatedAt = new Date();
    next();
});

var Item = exports.Item = mongoose.model('Item', ItemSchema);

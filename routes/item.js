var config = require('../util/config').config;
var Item = require('../data/item');

exports.list = function(req, res) {
    res.render('item/list');
};

exports.detail = function(req, res) {
    Item.findById(req.params.id, function(error, item) {
        if (error) {
            req.send(404);
            return;
        }
        res.render('item/detail', { item: item });
    });
};

exports.raw = function(req, res) {
    Item.findById(req.params.id, function(error, item) {
        if (error) {
            req.send(404);
            return;
        }
        res.set('Content-Type', item.type);
        res.sendfile(config.core.uploadItemsPath + '/' + item.id);
    });
};

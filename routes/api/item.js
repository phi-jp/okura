var User = require('../../data/user').User;
var Item = require('../../data/item').Item;

exports.list = function(req, res) {
    var where = {};
    [].forEach(function(paramName) {
        if (req.param(paramName)) {
            where[paramName] = req.param(paramName);
        }
    });

};

exports.detail = function(req, res) {

};


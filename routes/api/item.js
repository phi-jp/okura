var User = require('../../data/user');
var Item = require('../../data/item');
var util = require('../util');
var Flow = require('flow_js').Flow;

exports.list = function(req, res) {
    var where = {};
    [].forEach(function(paramName) {
        if (req.param(paramName)) {
            where[paramName] = req.param(paramName);
        }
    });
    var sort = {};
    if (req.param('sortBy')) {
        sort[req.param('sortBy')] = req.param('sortOrder') || 'asc';
    }
    var page = req.param('page') || 0;

    // count
    var count = function() {
        Item.count(where, function(error, num) {
            if (error) flow.miss(error);
            else {
                flow.pass(num);
                selectPage();
            }
        });
    };

    // select page
    var selectPage = function() {
        Item.query(where, sort, page, function(error, data) {
            if (error) flow.miss(error);
            else {
                flow.pass(data);
            }
        });
    };

    var flow = new Flow(2, function(error, args) {
        if (error) util.failXhr(res);
        else res.json({
            success: true,
            count: args[0],
            data: args[1]
        });
    });

    count();
};

exports.detail = function(req, res) {
};

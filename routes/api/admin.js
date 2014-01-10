var Flow = require('flow_js').Flow;
var User = require('../../data/user').User;
var util = require('../util');

exports.user = {};

exports.user.list = function(req, res) {
    var page = req.param('page') || 0;
    var where = {};
    if (req.param('name')) {
        where.name = new RegExp('^' + req.param('name'));
    }

    var junction = new Flow(2, function(error, results) {
        if (error) return util.failXhr(res, error);

        res.send(JSON.stringify({
            success: true,
            data: results[0][0],
            count: results[1][0]
        }));
    });
    var flowSelectPage = new Flow(1, junction);
    var flowCountAll = new Flow(1, junction);

    // select page
    User
        .find(where)
        .limit(10)
        .skip(10 * page)
        .sort({ id: 'asc' })
        .exec(function(error, docs) {
            if (error) {
                console.log("Error: " + error);
                flowSelectPage.miss();
            } else {
                flowSelectPage.pass(docs);
            }
        });

    // count all data
    User
        .count(where)
        .exec(function(error, count) {
            if (error) {
                console.log("Error: " + error);
                flowCountAll.miss();
            } else {
                flowCountAll.pass(count);
            }
        });
};

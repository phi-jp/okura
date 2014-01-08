var User = require('../../data/user').User;

exports.user = {};

exports.user.list = function(req, res) {
    var page = req.param('page') || 0;
    var where = {};
    if (req.param('name')) {
        where.name = new RegExp('^' + req.param('name'));
    }

    User
        .find(where)
        .limit(10)
        .skip(10 * page)
        .sort({name: 'asc'})
        .exec(function(error, docs) {
            if (error) return onError(error);

            User.count(where).exec(function(error, count) {
                if (error) return onError(error);

                res.send(JSON.stringify({
                    success: true,
                    data: docs,
                    count: count
                }));
            });
        });
};

var onError = function(res) {
    res.send(JSON.stringify({ success: false}));
};

var User = require('../data/user');

/** 
 * It's me!
 * set current user's twitterScreenName to request param
 */
exports.itsme = function(req, res, next) {
    req.params.twitterScreenName = req.session.user.twitterScreenName;
    next();
};

exports.list = function(req, res) {
    res.render('index', { title: 'user list' });
};

exports.detail = function(req, res) {
    User.findByTwitterScreenName(req.params.twitterScreenName, function(error, user) {
        if (user) {
            res.render('index', { title: 'user ' + user.name + ' \'s page' });
        } else {
            res.send(404);
        }
    });
};

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
    res.render('index', { title: 'user ' + req.params.twitterScreenName + ' \'s page' });
};

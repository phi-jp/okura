exports.mustLogin = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
};

exports.adminOnly = function(pageOrXhr) {
    return function(req, res, next) {
        if (req.session.user && req.session.user.admin) {
            next();
        } else {
            if (pageOrXhr === 'xhr') {
                res.send(JSON.stringify({
                    success: false
                }));
            } else {
                res.redirect('/');
            }
        }
    };
};

exports.mustLogin = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.send(403);
    }
};

exports.adminOnly = function(req, res, next) {
    if (req.session.user && req.session.user.admin) {
        next();
    } else {
        res.send(403);
    }
};

exports.failXhr = function(res, error) {
    console.error(error);
    res.json({ success: false });
};

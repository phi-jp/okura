exports.index = function(req, res) {
    res.render('functionTest', {
        title: 'function test',
        currentUser: req.session.user || { name: 'ゲスト' }
    });
};

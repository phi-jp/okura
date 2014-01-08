var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: 'X5O0LjAio4RteJnRoo287A',
    consumerSecret: 'O1YalKylA39HYJzFUVKi0PQYtk0wDe1WGLEj1FYkY',
    callback: 'http://localhost:1235/callback'
});

var User = require('../data/user').User;

exports.login = function(req, res) {
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
        if (error) {
            // TODO
            console.log('Error: getting OAuth request token: ' + error);
            res.send(500);
            return;
        }

        req.session.auth = {};
        req.session.auth.requestToken = requestToken;
        req.session.auth.requestTokenSecret = requestTokenSecret;
        var url = 'https://twitter.com/oauth/authenticate?oauth_token=' + req.session.auth.requestToken;
        res.redirect(url);
    });
};

exports.logout = function(req, res) {
    req.session.auth = null;
    req.session.user = null;
    res.redirect('/');
};

exports.callback = function(req, res, next) {
    var oauthVerifier = req.param('oauth_verifier');
    if (!oauthVerifier) {
        res.redirect('/');
        return;
    }

    var auth = req.session.auth;

    twitter.getAccessToken(auth.requestToken, auth.requestTokenSecret, oauthVerifier,
        function(error, accessToken, accessTokenSecret, results) {
            if (error) {
                // TODO
                console.log('Error: getting OAuth access token: ' + error);
                next(new Error('Error: getting OAuth access token'));
                return;
            }

            auth.accessToken = accessToken;
            auth.accessTokenSecret = accessTokenSecret;

            next();
        }
    );
};

exports.loadUser = function(req, res) {
    var onGetAccount = function(error, account, response) {
        if (error) {
            console.log(error);
            onLoadUser(null);
            return;
        }

        User.findOne({ twitterId: account.id }).exec(function(error, doc) {
            if (error) {
                console.log(error);
                onLoadUser(null);
                return;
            }

            var onCreateOrUpdate = function(error, product) {
                if (error) {
                    console.log(error);
                    onLoadUser(null);
                    return;
                }

                onLoadUser(product);
            };

            if (doc) {
                User.findByIdAndUpdate(doc.id, {
                    lastLoginedAt: new Date()
                }, onCreateOrUpdate);
            } else {
                User.create({
                    twitterId: account.id,
                    name: account.screen_name,
                    createdAt: new Date(),
                    lastLoginedAt: new Date()
                }, onCreateOrUpdate);
            }
        });
    };

    var onLoadUser = function(user) {
        req.session.user = user;
        res.redirect('/');
    };

    twitter.account(
        'verify_credentials',
        {},
        req.session.auth.accessToken,
        req.session.auth.accessTokenSecret,
        onGetAccount
    );
};

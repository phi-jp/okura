var config = require('../util/config').config;

var Flow = require('flow_js').Flow;

var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callback: 'http://' + config.core.domain + '/callback'
});

var User = require('../data/user');

exports.login = function(req, res) {
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
        if (error) {
            // TODO
            console.log('getting OAuth request token');
            console.dir(error);
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
    console.dir(auth);

    twitter.getAccessToken(auth.requestToken, auth.requestTokenSecret, oauthVerifier,
        function(error, accessToken, accessTokenSecret, results) {
            if (error) {
                // TODO
                console.log('getting OAuth access token');
                console.dir(error);
                next(new Error());
                return;
            }

            auth.accessToken = accessToken;
            auth.accessTokenSecret = accessTokenSecret;

            next();
        }
    );
};

exports.loadUser = function(req, res) {

    // 1. get twitter account by TwitterAPI.
    var getAccount = function() {
        twitter.account(
            'verify_credentials',
            {},
            req.session.auth.accessToken,
            req.session.auth.accessTokenSecret,
            function(error, account) {
                if (error) flow.miss(error);
                else {
                    flow.pass();
                    loadUser(account);
                }
            }
        );
    };

    // 2. find user data by twitter id.
    var loadUser = function(account) {
        User.findByTwitterId(account.id, function(error, user) {
            if (error) flow.miss(error);
            else {
                flow.pass();
                if (!user) createUser(account);
                else updateUser(user);
            }
        });
    };

    // 3-1. create new user data if not exists.
    var createUser = function(account) {
        console.log('create new user: ' + account.screen_name);
        User.create({
            twitterId: account.id,
            twitterScreenName: account.screen_name,
            name: account.screen_name,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginedAt: new Date(),
            admin: (config.core.adminUsers.indexOf(account.screen_name) !== -1)
        }, function(error, saved) {
            if (error) flow.miss(error);
            else flow.pass(saved);
        });
    };

    // 3-2. update user lastLoginedAt data.
    var updateUser = function(user) {
        console.log('welcome back user: ' + user.name);
        user.lastLoginedAt = new Date();
        User.update(user, function(error, saved) {
            if (error) flow.miss(error);
            else flow.pass(saved);
        });
    };

    // 4. finally, put user data into session, and redirect to top.
    var flow = new Flow(3, function(error, args) {

        if (error) {
            console.dir(error);
            req.session.user = null;
        } else req.session.user = args[0].toSessionObject();

        res.redirect('/');
    });

    getAccount();
};

var fs = require('fs');
var config = require('../util/config').config;
var Item = require('../data/item');

exports.index = function(req, res) {
    res.redirect('/function-test');
};

exports.submit = function(req, res) {

    var validate = function() {
        if (req.files.items) {
            console.dir(req.files.items);
            flow.pass();
            createNewItemData();
        } else {
            flow.miss();
        }
    };

    // 2. create new item in db.
    var createNewItemData = function() {
        Item.newItem(req.files.items.name, req.session.user, function(error, item) {
            if (error) flow.miss(error);
            else {
                flow.pass();
                renameFile(item);
            }
        });
    };

    // 3. rename temp file to item.id
    var renameFile = function(item) {
        var tempPath = req.files.items.path;
        var targetPath = config.core.uploadItemsPath + '/' + item.id;
        fs.rename(tempPath, targetPath, function(error) {
            if (error) flow.miss(error);
            else {
                flow.pass(item);
            }
        });
    };

    // 4. finally, redirect to item detail page.
    var flow = new Flow(3, function(error, args) {
        if (error) {
            console.dir(error);
            res.redirect('/function-test'); // TODO
        } else {
            res.redirect('/item/detail/' + args[0].id);
        }
    });

    validate();
};

var fs = require('fs');
var config = require('./config').config;

/**
 * @params {String} base64String
 * @params {String} path
 * @params {function} callback function(error, savedFilePath)
 */
exports.saveBase64 = function(base64String, path, callback) {
    var buffer = new Buffer(base64String, 'base64');
    fs.writeFile(path, buffer, function(error) {
        if (error) callback(error);
        else callback(null, path);
    });
};

/**
 * MIMEタイプに応じた拡張子を付加してバイナリデータをファイルに保存する.
 * 保存先はconfig.core.uploadItemsPath.
 *
 * @param {String} dataURL
 * @param {String} itemId
 * @param {function} callback function(error, savedFilePath)
 */
exports.saveDataURL = function(dataURL, itemId, callback) {
    dataURL = dataURL.replace(/^data:/, '');
    var ext;
    if (dataURL.match(/^image\/png/)) {
        ext = '.png';
    }

    exports.saveBase64(dataURL.replace(/image\/\w+;base64,/, ''), config.core.uploadItemsPath + '/' + itemId + ext, callback);
};

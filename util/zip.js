var fs = require('fs');
require('node-zip');

exports.zip = function(items) {
    var zip = new JSZip();
    items.forEach(function(item) {
        var buffer = fs.readFileSync(item.id);
        zip.file(item.fileName, buffer.toString('base64'), { base64: true });
    });
    return zip.generate({base64: false});
};

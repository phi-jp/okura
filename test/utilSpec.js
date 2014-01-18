var files = require('../util/files');

var fs = require('fs');
var config = require('../util/config').config;

// files.js
describe('util/files.js', function() {

    it('saveDataURL', function() {
        files.saveDataURL(dataURL, 'TEST', function(error, result) {
            expect(error).toBeNull();
            expect(result).toBe(config.core.uploadItemsPath + '/TEST.png');

            fs.unlink(result);
        });
    });

});

var dataURL = 'data:image/png;base64,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';
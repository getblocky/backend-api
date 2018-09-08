var crypto = require('crypto');
var fs = require('fs');

var config = require('../config');

module.exports = {
    getUserData: function (email, cb) {
        fs.readFile(config.dataFilePath + email + '.Blynk.user', 'utf8', function (err, contents) {
            if (!err) {
                userData = JSON.parse(contents);
                cb(err, userData);
            } else {
                cb(err, {});
            }
        });
    },
    createHash: function (password, email) {
        return crypto.createHash('sha256')
            .update(password, 'utf8')
            .update(makeHash(email))
            .digest('base64');
    }
}

function makeHash(val) {
    return crypto.createHash('sha256').update(val, 'utf8').digest();
}
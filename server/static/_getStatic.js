const path_ = require('path');

// this is used because im lazy

module.exports = function (path) {
    return path_.join(__dirname, `../../static/${path}`);
}
const path_ = require('path');

module.exports = function (path) {
    return path_.join(__dirname, `../../static/${path}`);
}
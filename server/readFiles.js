const fs = require('fs');

module.exports = function(path) {
    return fs.readdirSync(path, {withFileTypes: true})
    .map(item => item.name)
    .filter(item => item[0] !== "_");
}
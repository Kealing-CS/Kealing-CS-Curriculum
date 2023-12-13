const readFiles = require('../readFiles');
const path = require('path');

module.exports = function (app) {
    let files = readFiles(__dirname).filter(file => file !== "staticFiles.js");
    files.forEach(file => {
        require(path.join(__dirname, file))(app);
    })
}

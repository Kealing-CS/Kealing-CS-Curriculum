const readFiles = require('../readFiles');
const path = require('path');
const UM = require('../../db/UserManager');

module.exports = function (app) {
    const getStatic = require('./_getStatic');
    const UserManager = new UM();
    let files = readFiles(__dirname).filter(file => file !== "staticFiles.js");
    files.forEach(file => {
        require(path.join(__dirname, file))({app, getStatic, UserManager});
    })
}

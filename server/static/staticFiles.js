// gets all the endpoints (non api (aka the website))

const readFiles = require('../readFiles');
const path = require('path');
const UM = require('../../db/UserManager');

module.exports = function (app) {
    const getStatic = require('./_getStatic');
    const UserManager = new UM();
    const banned = require('./_banned');
    let files = readFiles(__dirname).filter(file => file !== "staticFiles.js");
    files.forEach(file => {
        require(path.join(__dirname, file))({app, getStatic, UserManager, banned});
    })
}

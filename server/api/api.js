const UM = require("../../db/UserManager.js");
const puppeteer = require('puppeteer');
const readFiles = require('../readFiles');
const levelinfo = require("../../db/levelinformation.json");
const path = require('path');

module.exports = function (app) {
    const UserManager = new UM();
    let files = readFiles(__dirname).filter(file => file !== "api.js" && file !== "api copy.js");
    files.forEach(file => {
        require(path.join(__dirname, file))({app: app, levelinfo: levelinfo, UserManager: UserManager, puppeteer: puppeteer});
    })
}

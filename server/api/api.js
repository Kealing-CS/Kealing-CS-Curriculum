const UM = require("../../db/UserManager.js");
const puppeteer = require('puppeteer');
const readFiles = require('../readFiles');
const LevelManager = require("../../db/LevelManager.js");
const path = require('path');

module.exports = function (app) {
    const UserManager = new UM();
    const levelManager = new LevelManager();
    let files = readFiles(__dirname).filter(file => file !== "api.js" && file !== "api copy.js");
    files.forEach(file => {
        require(path.join(__dirname, file))({app: app, UserManager: UserManager, puppeteer: puppeteer, LevelManager: levelManager});
    })
}

const Database = require('easy-json-database');
const path = require('path');


module.exports = class LevelManager {
    getRequiredLanguages(level) {
        let levelDB = new Database(path.join(__dirname, "levelinformation.json"));

        return levelDB.get(level)["needs"]
    }

    getCorrectLogs(level) {
        let levelDB = new Database(path.join(__dirname, "levelinformation.json"));

        return levelDB.get(level)["correctLogs"]
    }

    getBaseCode(level) {
        let levelDB = new Database(path.join(__dirname, "levelinformation.json"));

        return levelDB.get(level)["baseCode"]
    }

    getParents(level) {
        let levelDB = new Database(path.join(__dirname, "levelinformation.json"));

        return levelDB.get(level)["parents"]
    }

    getInstructions(level) {
        let levelDB = new Database(path.join(__dirname, "levelinformation.json"));

        return levelDB.get(level)["instructions"]
    }

    levelExists(level) {
        let levelDB = new Database(path.join(__dirname, "levelinformation.json"));

        return levelDB.get(level) !== undefined
    }
}
const Database = require('easy-json-database');
const Login = require('./Login.js');
const fs = require("fs");
const path = require('path');


module.exports = class UserManager extends Login {
    constructor() {
        super();
    }

    getUnlocked(username) {
        let dataDB = new Database('./db/userdata.json');

        try {
            return dataDB.get(username).unlocked;
        }
        catch {
            return [];
        }
    }

    unlockLevel(username, level) {
        let dataDB = new Database('./db/userdata.json');

        let data = dataDB.get(username);
        data.unlocked.push(level);

        dataDB.set(username, data);
    }

    getSubmitted(username) {
        let dataDB = new Database('./db/userdata.json');

        return dataDB.get(username).submitted.keys()
    }

    submitLevel(username, level, logs, err) {
        let dataDB = new Database('./db/userdata.json');


        let correctLogs = JSON.parse(fs.readFileSync("./db/levelinformation.json"))[level].correctLogs


        let submitted = dataDB.get(username)
        submitted.submitted[level] = [logs, err]
        dataDB.set(username, submitted)

        logs = JSON.stringify(logs)
        correctLogs = JSON.stringify(correctLogs)

        return correctLogs === logs
    }

    getCompleted(username) {
        let dataDB = new Database('./db/userdata.json');

        try {
            return dataDB.get(username).completed;
        }
        catch {
            return [];
        }
    }

    completeLevel(username, level) {
        let dataDB = new Database('./db/userdata.json');

        let data = dataDB.get(username);
        data.completed.push(level);

        dataDB.set(username, data);
    }

    getCode(username, level) {
        let dataDB = new Database('./db/userdata.json');

        try {
            return dataDB.get(username).code[level];
        }
        catch {
            return "";
        }
    }

    setCode(username, level, code) {
        let dataDB = new Database('./db/userdata.json');

        dataDB.set(username + ".code." + level, code);
    }

    isTeacher(username) {
        let dataDB = new Database('./db/userdata.json');

        try {
            return dataDB.get(username).teacher;
        }
        catch {
            return false;
        }
    }

    getClass(username) {
        let dataDB = new Database('./db/userdata.json');

        try {
            return dataDB.get(username).class;
        }
        catch {
            return null;
        }
    }

    setClass(username, classCode) {
        let dataDB = new Database('./db/userdata.json');

        // check if class code is valid, if not return false

        dataDB.set(username + ".class", classCode);
        return true;
    }
}
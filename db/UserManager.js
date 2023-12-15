const { QuickDB } = require("quick.db");
const Login = require('./Login.js');
const LevelManager = require('./LevelManager.js');
const fs = require("fs");
const path = require('path');


module.exports = class UserManager extends Login {
    constructor() {
        super();
        this.dataDB = new QuickDB({ filePath: './db/userdata.db'});
        this.sensativeDB = new QuickDB({ filePath: './db/sensitivedata.db'});
    }

    async getUnlocked(username) {
        try {
            return await this.dataDB.get(`${username}.unlocked`)
        }
        catch {
            console.log("couldnt get unlocked")
            return [];
        }
    }

    unlockLevel(username, level) {
        this.dataDB.push(`${username}.unlocked`, level);
    }

    async getSubmitted(username) {
        return await this.dataDB.get(`${username}.submitted`).keys();
    }

    async submitLevel(username, level, logs, err) {
        let lm = new LevelManager();
        let correctLogs = await lm.getCorrectLogs(level)

        this.dataDB.set(`${username}.submitted.${level}`, [logs, err]);

        logs = JSON.stringify(logs)
        correctLogs = JSON.stringify(correctLogs)

        return correctLogs === logs
    }

    async getCompleted(username) {
        try {
            return await this.dataDB.get(`${username}.completed`)
        }
        catch {
            console.log("couldnt get completed")
            return [];
        }
    }

    completeLevel(username, level) {
        this.dataDB.push(`${username}.completed`, level);
    }

    async getCode(username, level) {
        return await this.dataDB.get(`${username}.code.${level}`);
    }

    setCode(username, level, code) {
        this.dataDB.set(`${username}.code.${level}`, code);
    }

    async isTeacher(username) {
        return await this.dataDB.get(`${username}.teacher`);
    }

    async getClass(username) {
        return await this.dataDB.get(`${username}.class`);
    }

    setClass(username, classCode) {
        this.dataDB.set(`${username}.class`, classCode);
    }
}
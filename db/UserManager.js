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
        /* get the code for a level for a user
            username: the username of the user to get the code of
            level: the level id to get the code of
        */
        return await this.dataDB.get(`${username}.code.${level}`);
    }

    setCode(username, level, code) {
        /* set the code for a level for a user
            username: the username of the user to set the code of
            level: the level id to set the code of
            code: the code to set the users code to
        */
        this.dataDB.set(`${username}.code.${level}`, code);
    }

    async exists(username) {
        /* checks if the user exists
            username: the username of the user to check
        */
        return await this.sensativeDB.has(username);
    }

    async isTeacher(username) {
        /* checks if the user is a teacher
            username: the username of the user to check
        */
        return await this.dataDB.get(`${username}.teacher`);
    }

    async getClass(username) {
        /* get the class code of a user
            username: the username of the user to get the class code of
        */
        return await this.dataDB.get(`${username}.class`);
    }

    setClass(username, classCode) {
        /* set a users class to a class code
            username: the username of the user to set the class of
            classCode: the class code to set the users class to
        */
        this.dataDB.set(`${username}.class`, classCode);
    }

    isAdmin(username) {
        /* checks if the user is an admin
            username: the username of the user to check
        */
        const admins = JSON.parse(fs.readFileSync(path.join(__dirname, "./admins.json")));
        return admins.includes(username);
    }

    setAdmin(username) {
        /* adds the user to the admins.json file
            username: the username of the user to add to the admins.json file
        */
        const admins = JSON.parse(fs.readFileSync(path.join(__dirname, "./admins.json")));
        admins.push(username);
        fs.writeFileSync(path.join(__dirname, "./admins.json"), JSON.stringify(admins));
    }

    async isStudent(username) {
        return !(await this.isTeacher(username)) &&
               !(await this.isAdmin(username));
    }

    async isBanned(username) {
        return await this.dataDB.get(`${username}.banned`);
    }

    async getBanReason(username) {
        return await this.dataDB.get(`${username}.banReason`);
    }

    async ban(username, reason) {
        await this.dataDB.set(`${username}.banned`, true);
        await this.dataDB.set(`${username}.banReason`, reason);
    }

    async unban(username) {
        await this.dataDB.set(`${username}.banned`, false);
        await this.dataDB.set(`${username}.banReason`, "");
    }

    async getBanned() {
        let users = await this.dataDB.keys();
        let banned = [];
        for (let user of users) {
            if (await this.isBanned(user)) {
                banned.push(user);
            }
        }
        return banned;
    }
}
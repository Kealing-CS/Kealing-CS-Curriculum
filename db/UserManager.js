const { QuickDB } = require("quick.db");
const Login = require('./Login.js');
const LevelManager = require('./LevelManager.js');
const fs = require("fs");
const path = require('path');


module.exports = class UserManager extends Login {
    constructor() {
        super();
        this.classDB = new QuickDB({ filePath: './db/classes.db'});
    }

    async getUnlocked(username) {
        try {
            return await this.dataDB.get(`users.${username}.unlocked`)
        }
        catch {
            console.log("couldnt get unlocked")
            return [];
        }
    }

    unlockLevel(username, level) {
        this.dataDB.push(`users.${username}.unlocked`, level);
    }

    async getSubmitted(username) {
        return await this.dataDB.get(`users.${username}.submitted`).keys();
    }

    async submitLevel(username, level, logs, err) {
        let lm = new LevelManager();
        let correctLogs = await lm.getCorrectLogs(level)

        this.dataDB.set(`users.${username}.submitted.${level}`, [logs, err]); // set the submitted code

        logs = JSON.stringify(logs)
        correctLogs = JSON.stringify(correctLogs)

        // return if the logs were correct
        return correctLogs === logs
    }

    // get the completed levels of a user
    // (completed means ones that were submitted and correct)
    async getCompleted(username) {
        return await this.dataDB.get(`users.${username}.completed`)
    }

    // set a level as completed for a user
    completeLevel(username, level) {
        this.dataDB.push(`users.${username}.completed`, level);
    }

    // check if the code for a level for a user exists
    async codeExists(username, level) {
        return await this.dataDB.has(`users.${username}.code.${level}`);
    }

    // get the code for a level for a user
    async getCode(username, level) {
        return await this.dataDB.get(`users.${username}.code.${level}`);
    }

    //set the code for a level for a user
    setCode(username, level, code) {
        this.dataDB.set(`users.${username}.code.${level}`, code);
    }

    // checks if the user exists
    async exists(username) {
        return await this.sensitiveDB.has(username);
    }

    // checks if the user is a teacher
    async isTeacher(username) {
        return await this.dataDB.get(`users.${username}.teacher`);
    }

    // get the class code of a user
    async getClass(username) {
        return await this.dataDB.get(`users.${username}.class`);
    }

    // get the students of a class
    async getStudents(classCode) {
        return await this.classDB.get(`${classCode}.students`);
    }

    // check if a user is an admin
    isAdmin(username) {
        const admins = JSON.parse(fs.readFileSync(path.join(__dirname, "./admins.json")));
        return admins.includes(username);
    }

    // make a user an admin
    setAdmin(username) {
        const admins = JSON.parse(fs.readFileSync(path.join(__dirname, "./admins.json")));
        admins.push(username);
        fs.writeFileSync(path.join(__dirname, "./admins.json"), JSON.stringify(admins));
    }

    // check if a user is a student
    async isStudent(username) {
        return !(await this.isTeacher(username)) &&
               !(await this.isAdmin(username));
    }

    // check if a user is banned
    async isBanned(username) {
        return await this.dataDB.get(`users.${username}.banned`);
    }

    // get the ban reason of a user
    async getBanReason(username) {
        return await this.dataDB.get(`users.${username}.banReason`);
    }

    // ban a user
    async ban(username, reason) {
        await this.dataDB.set(`users.${username}.banned`, true);
        await this.dataDB.set(`users.${username}.banReason`, reason);
    }

    // unban a user
    async unban(username) {
        await this.dataDB.set(`users.${username}.banned`, false);
        await this.dataDB.set(`users.${username}.banReason`, "");
    }

    // check if a class code exists
    async classCodeExists(code) {
        let classes = await this.classDB.keys();
        return classes.includes(code);
    }

    // generate a class code
    async _generateClassCode() {
        let code;
        // js is such a weird language
        // this runs the code inside, then checks the while condition
        do {
            code = Math.random().toString(36).substring(2, 8);
        } while (await this.classCodeExists(code));
        return code;
    }

    // create a class
    async createClass(username) {
        let classCode = await this._generateClassCode();
        this.dataDB.push(`users.${username}.class`, classCode);
        this.classDB.set(`${classCode}.teacher`, username);
        this.classDB.set(`${classCode}.students`, []);
        return classCode;
    }

    //  set a users class to a class code & add them to the class
    async joinClass(username, classCode) {
        if (!(await this.classCodeExists(classCode))) {
            this.dataDB.set(`users.${username}.class`, classCode);
            this.classDB.push(`${classCode}.students`, username);
            return true;
        }
        return false;
    }

    // set a users class to null & remove them from the class
    async leaveClass(username) {
        let classCode = await this.getClass(username);
        this.dataDB.set(`users.${username}.class`, null);
        this.classDB.pull(`${classCode}.students`, username);
    }

    requestTeacher(username) {
        this.dataDB.push("teacherRequests", username);
    }

    async getTeacherRequests() {
        return await this.dataDB.get("teacherRequests");
    }

    async acceptTeacher(username) {
        this.dataDB.set(`users.${username}.teacher`, true);
        this.dataDB.set(`users.${username}.class`, []);
        this.dataDB.pull("teacherRequests", username);
    }
}
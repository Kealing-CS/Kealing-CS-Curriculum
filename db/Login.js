const { QuickDB } = require("quick.db");
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";

module.exports = class LoginManager {
    constructor() {}

    async checkLogin(username, token) {
        let dataDB = new QuickDB({ filePath: './db/userdata.db'});
        let sensitiveDB = new QuickDB({ filePath: './db/sensitivedata.db'});

        if (!await sensitiveDB.get(username)) {
            return [false, "Username not found"];
        }
        if (await dataDB.get(`${username}.token`) != token) {
            console.log(await dataDB.get(`${username}.token`), token);
            return [false, "Incorrect token"];
        }
        if (await dataDB.get(`${username}.lastLogin`) + 604800000 < Date.now()) {
            return [false, "Token expired"];
        }
        return [true, "Login successful"];
    }

    async freshLogin(username, password) {
        let dataDB = new QuickDB({ filePath: './db/userdata.db'});
        let sensitiveDB = new QuickDB({ filePath: './db/sensitivedata.db'});

        if (!await sensitiveDB.get(username)) {
            return [false, "username"];
        }

        // vscode is stupid and says this await is unnecessary but its VERY necessary
        if (!await bcrypt.compare(password, await sensitiveDB.get(username))) {
            return [false, "pasword"];
        }

        for (const char of username.toLowerCase()) {
            if (!LETTERS.includes(char) && !NUMBERS.includes(char) && char !== "_") {
                return [false, "username"];
            }
        }

        for (const char of password.toLowerCase()) {
            if (!LETTERS.includes(char) && !NUMBERS.includes(char) && char !== "_") {
                return [false, "password"];
            }
        }

        let token = this._generateToken();

        await dataDB.set(`${username}.token`, token);
        await dataDB.set(`${username}.lastLogin`, Date.now());

        return [true, "Login successful", token];
    }

    _hashPassword(password, saltRounds) {
        return bcrypt.hashSync(password, saltRounds);
    }

    _generateToken() {
        return crypto.randomBytes(16).toString('base64').replace("+", "-");
    }
        

    async createAccount(username, password, teacher=false) {
        let dataDB = new QuickDB({ filePath: './db/userdata.db'});
        let sensitiveDB = new QuickDB({ filePath: './db/sensitivedata.db'});
        
        if (await sensitiveDB.get(username)) {
            return [false, "uat"];
        }

        if (username.length < 3 || username.length > 16) {
            return [false, "username"];
        }
        if (password.length < 8 || password.length > 32) {
            return [false, "password"];
        }

        for (const char of username.toLowerCase()) {
            if (!LETTERS.includes(char) && !NUMBERS.includes(char) && char !== "_") {
                return [false, "username"];
            }
        }

        for (const char of password.toLowerCase()) {
            if (!LETTERS.includes(char) && !NUMBERS.includes(char) && char !== "_") {
                return [false, "password"];
            }
        }

        await sensitiveDB.set(username, this._hashPassword(password, 10));
        let token = this._generateToken();
        dataDB.set(username, {
            "unlocked": ["start", "sandbox"],
            "submitted": {
            },
            "completed": [],
            "code": {
                "start": ""
            },
            "teacher": teacher,
            "token": token,
            "lastLogin": Date.now(),
            "class": teacher ? "" : null,
            "banned": false,
            "banReason": "",
        });
        return [true, "Account created", token];
    }
};
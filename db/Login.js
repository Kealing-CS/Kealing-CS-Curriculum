const { QuickDB } = require("quick.db");
const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = class LoginManager {
    constructor() {}

    async checkLogin(username, token) {
        let dataDB = new QuickDB({ filePath: './db/userdata.db'});
        let sensitiveDB = new QuickDB({ filePath: './db/sensitivedata.db'});

        if (!await sensitiveDB.get(username)) {
            return [false, "Username not found"];
        }
        if (await dataDB.get(`${username}.token`) != token) {
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
            return [false, "Username not found"];
        }

        if (!bcrypt.compare(password, await sensitiveDB.get(username))) {
            return [false, "Incorrect password"];
        }

        let token = this._generateToken();

        await dataDB.set(`${username}.token`, token);
        console.log(token)
        await dataDB.set(`${username}.lastLogin`, Date.now());

        return [true, "Login successful", token];
    }

    _hashPassword(password, saltRounds) {
        return bcrypt.hashSync(password, saltRounds);
    }

    _generateToken() {
        return crypto.randomBytes(16).toString('base64');
    }
        

    async createAccount(username, password, teacher=false) {
        let dataDB = new QuickDB({ filePath: './db/userdata.db'});
        let sensitiveDB = new QuickDB({ filePath: './db/sensitivedata.db'});
        
        if (await sensitiveDB.get(username)) {
            return [false, "Username already taken"];
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
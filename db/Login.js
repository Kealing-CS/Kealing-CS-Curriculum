const { QuickDB } = require("quick.db");
const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = class LoginManager {
    constructor() {}

    // check the username and token of a user
    async checkLogin(username, token) {
        let dataDB = new QuickDB({ filePath: './db/userdata.db'});
        let sensitiveDB = new QuickDB({ filePath: './db/sensitivedata.db'});

        // make sure the person exists
        if (!await sensitiveDB.has(username)) {
            return [false, "Username not found"];
        }
        // make sure the token is correct
        if (await dataDB.get(`${username}.token`) != token) {
            return [false, "Incorrect token"];
        }
        // make sure the token is not expired
        if (await dataDB.get(`${username}.lastLogin`) + 604800000 < Date.now()) {
            return [false, "Token expired"];
        }
        // this is the person they say they are :3
        return [true, "Login successful"];
    }

    // make sure the password is correct
    async checkPassword(username, password) {
        let sensitiveDB = new QuickDB({ filePath: './db/sensitivedata.db'});

        // vscode is stupid and says this await is unnecessary but its VERY necessary
        return await bcrypt.compare(password, await sensitiveDB.get(username))
    }

    // make a new token for a user
    async freshLogin(username) {
        let dataDB = new QuickDB({ filePath: './db/userdata.db'});

        let token = this._generateToken();

        await dataDB.set(`${username}.token`, token);
        await dataDB.set(`${username}.lastLogin`, Date.now());

        return token;
    }

    // hash a password
    _hashPassword(password, saltRounds) {
        return bcrypt.hashSync(password, saltRounds);
    }

    // generate a cryptographically secure token
    _generateToken() {
        return crypto.randomBytes(16).toString('base64').replace("+", "-");
    }
        
    // create a new account
    async createAccount(username, password) {
        let dataDB = new QuickDB({ filePath: './db/userdata.db'});
        let sensitiveDB = new QuickDB({ filePath: './db/sensitivedata.db'});

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
            "teacher": false,
            "token": token,
            "lastLogin": Date.now(),
            "class": null,
            "banned": false,
            "banReason": "",
        });
        return token;
    }
};
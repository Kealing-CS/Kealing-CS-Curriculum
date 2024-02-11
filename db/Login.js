const { QuickDB } = require("quick.db");
const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = class LoginManager {
    constructor() {
        this.dataDB = new QuickDB({ filePath: './db/userdata.db'});
        this.sensitiveDB = new QuickDB({ filePath: './db/sensitivedata.db'});
    }

    // check the username and token of a user
    async checkLogin(username, token) {

        // make sure the person exists
        if (!await this.sensitiveDB.has(username)) {
            return [false, "Username not found"];
        }
        // make sure the token is correct
        if (await this.dataDB.get(`users.${username}.token`) != token) {
            return [false, "Incorrect token"];
        }
        // make sure the token is not expired
        if (await this.dataDB.get(`users.${username}.lastLogin`) + 604800000 < Date.now()) {
            return [false, "Token expired"];
        }
        // this is the person they say they are :3
        return [true, "Login successful"];
    }

    // make sure the password is correct
    async checkPassword(username, password) {

        // vscode is stupid and says this await is unnecessary but its VERY necessary
        return await bcrypt.compare(password, await this.sensitiveDB.get(username))
    }

    // make a new token for a user
    async freshLogin(username) {

        let token = this._generateToken();

        await this.dataDB.set(`users.${username}.token`, token);
        await this.dataDB.set(`users.${username}.lastLogin`, Date.now());

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

        await this.sensitiveDB.set(username, this._hashPassword(password, 10));
        let token = this._generateToken();
        this.dataDB.set(`users.${username}`, {
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
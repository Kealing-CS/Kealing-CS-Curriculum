const Database = require('easy-json-database');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = class LoginManager {
    constructor() {}

    checkLogin(username, token) {
        let dataDB = new Database('./db/userdata.json');
        let sensativeDB = new Database('./db/sensative.json');
        if (!sensativeDB.get(username)) {
            return [false, "Username not found"];
        }
        if (token !== dataDB.get(username).token) {
            return [false, "Incorrect token"];
        }
        if (dataDB.get(username).lastLogin + 604800000 < Date.now()) {
            return [false, "Token expired"];
        }
        return [true, "Login successful"];
    }

    freshLogin(username, password) {
        let dataDB = new Database('./db/userdata.json');
        let sensativeDB = new Database('./db/sensative.json');

        if (!sensativeDB.get(username)) {
            return [false, "Username not found"];
        }
        if (!bcrypt.compareSync(password, sensativeDB.get(username))) {
            return [false, "Incorrect password"];
        }
        let usr = dataDB.get(username);
        usr.token = this._generateToken();
        usr.lastLogin = Date.now();
        dataDB.set(username, usr);

        return [true, "Login successful", usr.token];
    }

    _hashPassword(password, saltRounds) {
        return bcrypt.hashSync(password, saltRounds);
    }

    _generateToken() {
        return crypto.randomBytes(16).toString('base64');
    }
        

    createAccount(username, password, teacher=false) {
        let dataDB = new Database('./db/userdata.json');
        let sensativeDB = new Database('./db/sensative.json');

        if (sensativeDB.get(username)) {
            return [false, "Username already taken"];
        }
        sensativeDB.set(username, this._hashPassword(password, 10));
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
            "class": teacher ? "" : null
        });
        return [true, "Account created", token];
    }
};
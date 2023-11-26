const Database = require('easy-json-database');
const bcrypt = require('bcrypt');

module.exports = class UserManager {
    constructor() {
        this.dataDB = new Database('./db/userdata.json');
        this.sensativeDB = new Database('./db/sensative.json');
    }

    createAccount(username, password) {
        if (this.sensativeDB.get(username)) {
            return [false, "Username already taken"];
        }
        this.sensativeDB.set(username, this._hashPassword(password, 10));
        this.dataDB.set(username, {
            "levels": ["start"],
            "code": {
                "start": "",
                "js": ""
            }
        });
        return [true, "Account created"];
    }

    checkLogin(username, password) {
        if (!this.sensativeDB.get(username)) {
            return [false, "Username not found"];
        }
        if (this.sensativeDB.get(username) != this._hashPassword(password, 10)) {
            return [false, "Incorrect password"];
        }
        return [true, "Login successful"];
    }

    _hashPassword(password, saltRounds) {
        return bcrypt.hashSync(password, saltRounds);
    }

    getlevels(username) {
        return this.dataDB.get(username).levels;
    }

    addlevel(username, level) {
        this.dataDB.push(username + ".levels", level);
    }

    getCode(username, level) {
        return this.dataDB.get(username).code[level];
    }

    setCode(username, level, code) {
        this.dataDB.set(username + ".code." + level, code);
    }
}
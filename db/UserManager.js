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
            "lessons": ["start"],
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

    getLessons(username) {
        return this.dataDB.get(username).lessons;
    }

    addLesson(username, lesson) {
        this.dataDB.push(username + ".lessons", lesson);
    }

    getCode(username, lesson) {
        return this.dataDB.get(username).code[lesson];
    }

    setCode(username, lesson, code) {
        this.dataDB.set(username + ".code." + lesson, code);
    }
}
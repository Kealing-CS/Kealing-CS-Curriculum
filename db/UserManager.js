const Database = require('easy-json-database');
const bcrypt = require('bcrypt');

module.exports = class UserManager {
    createAccount(username, password) {
        let dataDB = new Database('./db/userdata.json');
        let sensativeDB = new Database('./db/sensative.json');

        if (sensativeDB.get(username)) {
            return [false, "Username already taken"];
        }
        sensativeDB.set(username, this._hashPassword(password, 10));
        dataDB.set(username, {
            "unlocked": ["start"],
            "completed": [],
            "code": {
                "start": ""
            }
        });
        return [true, "Account created"];
    }

    checkLogin(username, password) {
        let sensativeDB = new Database('./db/sensative.json');
        if (!sensativeDB.get(username)) {
            return [false, "Username not found"];
        }
        if (bcrypt.compareSync(password, sensativeDB.get(username))) {
            return [false, "Incorrect password"];
        }
        return [true, "Login successful"];
    }

    _hashPassword(password, saltRounds) {
        return bcrypt.hashSync(password, saltRounds);
    }

    getUnlocked(username) {
        let dataDB = new Database('./db/userdata.json');

        try {
            return dataDB.get(username).unlocked;
        }
        catch {
            return [];
        }
    }

    unlockLevel(username, level) {
        let dataDB = new Database('./db/userdata.json');

        let data = dataDB.get(username);
        data.unlocked.push(level);

        dataDB.set(username, data);
    }

    getCompleted(username) {
        let dataDB = new Database('./db/userdata.json');

        try {
            return dataDB.get(username).completed;
        }
        catch {
            return [];
        }
    }

    completeLevel(username, level) {
        let dataDB = new Database('./db/userdata.json');

        let data = dataDB.get(username);
        data.completed.push(level);

        dataDB.set(username, data);
    }

    getCode(username, level) {
        let dataDB = new Database('./db/userdata.json');

        try {
            return dataDB.get(username).code[level];
        }
        catch {
            return "";
        }
    }

    setCode(username, level, code) {
        let dataDB = new Database('./db/userdata.json');

        dataDB.set(username + ".code." + level, code);
    }
}
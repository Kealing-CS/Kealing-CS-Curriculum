const UM = require("./db/UserManager.js");
const levelinfo = require("./db/levelinformation.json");

module.exports = function (app) {
    const UserManager = new UM();

    app.get("/api/getInstructions", function(req, res) {
        const level = req.query.level;
        if (!levelinfo[level]) {
            res.sendStatus(404);
            return;
        }
        res.send(levelinfo[level]["instructions"]);
    });

    app.get("/api/getRequiredLanguages", function(req, res) {
        const level = req.query.level;
        if (!levelinfo[level]) {
            res.sendStatus(404);
            return;
        }
        res.send(levelinfo[level]["needs"])
    });

    app.post("/api/submit", function(req, res) {
        const code = req.body.code;
        const user = req.body.user;
        const password = req.body.password;
        const level = req.body.level;

        if (!UserManager.checkLogin(user, password)) {
            res.sendStatus(401);
            return;
        }

        if (!UserManager.getUnlocked(user).includes(level)) {
            res.sendStatus(403);
            return;
        }

        UserManager.setCode(user, level, code);
        UserManager.completeLevel(user, level)
        // TODO: check if code works, if so: //
        let completed = UserManager.getCompleted(user);
        for (let key in levelinfo) {
            if (levelinfo[key]["parents"]) {
                let allCompleted = levelinfo[key]["parents"].every(v => completed.includes(v))
                if (allCompleted) {
                    UserManager.unlockLevel(user, key);
                }
            }
        }
        res.sendStatus(200);
    })

    app.get("/api/getUnlocked", function(req, res) {
        user = req.query.user;
        res.send(UserManager.getUnlocked(user));
    })

    app.get("/api/getCompleted", function(req, res) {
        user = req.query.user;
        res.send(UserManager.getCompleted(user));
    })

    app.get("/api/getCode", function(req, res) {
        user = req.query.user;
        password = req.query.password;
        level = req.query.level;
        if (!UserManager.checkLogin(user, password)) {
            res.sendStatus(401);
            return;
        }
        res.send(UserManager.getCode(user, level));
    })

    app.post("/api/setCode", function(req, res) {
        user = req.body.user;
        password = req.body.password;
        level = req.body.level;
        code = req.body.code;
        if (!UserManager.checkLogin(user, password)) {
            res.sendStatus(401);
            return;
        }
        UserManager.setCode(user, level, code);
    })

    app.post("/api/createAccount", function(req, res) {
        user = req.body.user;
        password = req.body.password;
        res.send(UserManager.createAccount(user, password));
    })

    app.get("/api/login", function(req, res) {
        user = req.query.user;
        password = req.query.password;
        console.log(user, password);
        res.send(UserManager.checkLogin(user, password));
    })
}
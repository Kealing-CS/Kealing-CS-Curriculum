const UM = require("./db/UserManager.js");
const instructions = require("./db/instructions.json");

module.exports = function (app) {
    const UserManager = new UM();

    app.get("/api/getInstructions", function(req, res) {
        const level = req.query.level;
        if (!instructions[level]) {
            res.sendStatus(404);
            return;
        }
        res.send(instructions[level]);
    })

    app.post("/api/submit", function(req, res) {
        const code = req.body.code;
        const user = req.body.user;
        const password = req.body.password;
        const level = req.body.level;
        if (!UserManager.checkLogin(user, password)) {
            res.sendStatus(401);
            return;
        }
        UserManager.setCode(user, level, code);
        // check if code works
        // if it works:
        UserManager.addlevel(user, level);
        res.send(true);
    })

    app.get("/api/getlevels", function(req, res) {
        user = req.query.user;
        res.send(UserManager.getlevels(user));
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

    app.post("/api/login", function(req, res) {
        user = req.body.user;
        password = req.body.password;
        res.send(UserManager.checkLogin(user, password));
    })
}
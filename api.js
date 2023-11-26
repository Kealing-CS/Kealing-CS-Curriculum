const UM = require("./db/UserManager.js");
const instructions = require("./db/instructions.json");

module.exports = function (app) {
    const UserManager = new UM();

    app.get("/api/getInstructions", function(req, res) {
        const lesson = req.query.lesson;
        if (!instructions[lesson]) {
            res.sendStatus(404);
            return;
        }
        res.send(instructions[lesson]);
    })

    app.post("/api/submit", function(req, res) {
        const code = req.body.code;
        const user = req.body.user;
        const password = req.body.password;
        const lesson = req.body.lesson;
        if (!UserManager.checkLogin(user, password)) {
            res.sendStatus(401);
            return;
        }
        UserManager.setCode(user, lesson, code);
        // check if code works
        // if it works:
        UserManager.addLesson(user, lesson);
        res.send(true);
    })

    app.get("/api/getLessons", function(req, res) {
        user = req.query.user;
        res.send(UserManager.getLessons(user));
    })

    app.get("/api/getCode", function(req, res) {
        user = req.query.user;
        password = req.query.password;
        lesson = req.query.lesson;
        if (!UserManager.checkLogin(user, password)) {
            res.sendStatus(401);
            return;
        }
        res.send(UserManager.getCode(user, lesson));
    })

    app.post("/api/setCode", function(req, res) {
        user = req.body.user;
        password = req.body.password;
        lesson = req.body.lesson;
        code = req.body.code;
        if (!UserManager.checkLogin(user, password)) {
            res.sendStatus(401);
            return;
        }
        UserManager.setCode(user, lesson, code);
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
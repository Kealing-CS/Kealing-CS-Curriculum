const UM = require("../../db/UserManager.js");
const levelinfo = require("../../db/levelinformation.json");
const puppeteer = require('puppeteer');

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

    app.post("/api/submit", async function(req, res) {
        const code = req.body.code;
        const user = req.body.user;
        const token = req.body.token;
        const level = req.body.level;

        /*
        fetch("/api/submit", {
            method: "POST",
            body: JSON.stringify({
                user: "username",
                token: "token",
                level: "level",
                code: {
                    html: "htmlcode",
                    js: "jscode",
                    css: "csscode"
                }
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        */

        if (!UserManager.checkLogin(user, token)) {
            res.sendStatus(401);
            return;
        }

        if (!UserManager.getUnlocked(user).includes(level)) {
            res.sendStatus(403);
            return;
        }

        UserManager.setCode(user, level, code);
        const browser = await puppeteer.launch({headless: "new"});
        const page = await browser.newPage();
        await page.setContent(code["html"])
        await page.addStyleTag({content: code["css"]})
        await page.addScriptTag({path: "./static/js/pptrRunJS.js"})
        let logs;
        try {
            await page.evaluate(code["js"]);
            logs = await page.evaluate("BGVavnha2vyCqDt6tGrjWWHwn")
            if (UserManager.submitLevel(user, level, logs, '')) 
            res.send(true)
            else
            res.send(false)
        }
        catch(e) {
            try {logs = await page.evaluate("BGVavnha2vyCqDt6tGrjWWHwn")}
            catch {
                logs = []
                UserManager.submitLevel(user, level, logs, "Annoying kid: logs are undefined")
                res.send(false)
            }
            UserManager.submitLevel(user, level, logs, `${e.name}: ${e.message}`)
            res.send(false)
            return
        }
        await browser.close();
    });

    app.get("/api/getUnlocked", function(req, res) {
        user = req.query.user;
        res.send(UserManager.getUnlocked(user));
    });

    app.get("/api/getCompleted", function(req, res) {
        user = req.query.user;
        res.send(UserManager.getCompleted(user));
    });

    app.get("/api/getCode", function(req, res) {
        user = req.query.user;
        token = req.query.token;
        level = req.query.level;
        if (!UserManager.checkLogin(user, token)) {
            res.sendStatus(401);
            return;
        }
        res.send(UserManager.getCode(user, level));
    });

    app.post("/api/setCode", function(req, res) {
        user = req.body.user;
        token = req.body.token;
        level = req.body.level;
        code = req.body.code;
        if (!UserManager.checkLogin(user, token)) {
            res.sendStatus(401);
            return;
        }
        UserManager.setCode(user, level, code);
    });

    // this is a post request so the password is not sent in the url
    app.post("/api/createAccount", function(req, res) {
        user = req.body.user;
        password = req.body.password;
        res.send(UserManager.createAccount(user, password));
    });

    // this is a post request so the token is not sent in the url
    app.post("/api/login", function(req, res) {
        user = req.body.user;
        token = req.body.token;
        res.send(UserManager.checkLogin(user, token));
    });


    // this is a post request so the password is not sent in the url
    app.post("/api/freshLogin", function(req, res) {
        user = req.body.user;
        password = req.body.password;
        
        res.send(UserManager.freshLogin(user, password));
    });

    app.get("/api/getBaseCode", function(req, res) {
        level = req.query.level;
        res.send(levelinfo[level]["baseCode"]);
    });

    app.get("/api/joinClass", function(req, res) {
        user = req.query.user;
        token = req.query.token;
        classCode = req.query.classCode;

        if (UserManager.checkLogin(user, token)) {
            res.sendStatus(401);
            return;
        }

        if (!UserManager.isTeacher(user)) {
            res.sendStatus(403);
            return;
        }

        if (!UserManager.joinClass(user, classCode)) {
            res.sendStatus(404);
            return;
        }
        
        res.sendStatus(200);
    });
}
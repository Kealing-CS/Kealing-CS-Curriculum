module.exports = function ({app, UserManager, puppeteer}) {
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

        let unlocked = await UserManager.getUnlocked(user);

        if (!unlocked.includes(level)) {
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
}
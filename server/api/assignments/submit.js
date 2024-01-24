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
        if (!(await UserManager.checkLogin(user, token))[0]) {
            res.sendStatus(401);
            return;
        }

        let unlocked = await UserManager.getUnlocked(user);

        if (!unlocked.includes(level)) {
            res.sendStatus(403);
            return;
        }

        // use puppeteer to run the code
        // this wont work on computers without a gui, idk why because its headless but wtv
        UserManager.setCode(user, level, code);
        const browser = await puppeteer.launch({headless: "new"});
        const page = await browser.newPage();
        await page.setContent(code["html"])
        await page.addStyleTag({content: code["css"]})
        await page.addScriptTag({path: "./static/js/pptrRunJS.js"})
        let logs;
        try {
            await page.evaluate(code["js"]);
            // this is the logs, i was too lazy to work on plugging xss shit at the time so i just made a weird variable
            logs = await page.evaluate("BGVavnha2vyCqDt6tGrjWWHwn")
            // the blank string means theres no error
            if (UserManager.submitLevel(user, level, logs, '')) 
            // logs were correct
            res.status(200);
            else
            // this means the logs were incorrect, i just was too lazy to find the actual status code for this
            res.status(418);
        }
        catch(e) {
            try {logs = await page.evaluate("BGVavnha2vyCqDt6tGrjWWHwn")}
            catch {
                logs = []
                UserManager.submitLevel(user, level, logs, "Annoying kid: logs are undefined")
                res.sendStatus(420);
                // enhance your calm (basically a "fuck you")
                return;
            }
            // submit it with the error
            UserManager.submitLevel(user, level, logs, `${e.name}: ${e.message}`);
            res.send(418)
            return;
        }
        await browser.close();
    });
}
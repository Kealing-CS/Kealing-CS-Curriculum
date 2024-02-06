module.exports = function ({app, UserManager}) {
    app.get("/api/getCode", async function(req, res) {
        const user = req.query.user;
        const token = req.query.token;
        const level = req.query.level;
        
        // the problem was the + is counted as a space in the url. god fucking damnit

        const checkLogin = await UserManager.checkLogin(user, token);

        if (!checkLogin[0]) {
            res.sendStatus(401);
            return;
        }

        let code = await UserManager.getCode(user, level)

        if (code === "") {
            res.sendStatus(404);
            return;
        }

        res.send(code);
    });
}
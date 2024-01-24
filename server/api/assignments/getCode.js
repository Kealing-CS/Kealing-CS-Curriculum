module.exports = function ({app, UserManager}) {
    app.get("/api/getCode", async function(req, res) {
        const user = req.query.user;
        const token = req.query.token;
        const level = req.query.level;
        
        // the problem was the + is counted as a space in the url. god fucking damnit

        const t = await UserManager.checkLogin(user, token)

        if (!t[0]) {
            res.sendStatus(401);
            return;
        }
        res.send(await UserManager.getCode(user, level));
    });
}
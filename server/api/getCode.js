module.exports = function ({app, UserManager}) {
    app.get("/api/getCode", async function(req, res) {
        const user = req.query.user;
        const token = req.query.token;
        const level = req.query.level;
        if (!UserManager.checkLogin(user, token)) {
            res.sendStatus(401);
            return;
        }
        res.send(await UserManager.getCode(user, level));
    });
}
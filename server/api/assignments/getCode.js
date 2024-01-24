module.exports = function ({app, UserManager}) {
    app.get("/api/getCode", async function(req, res) {
        const user = req.query.user;
        const token = req.query.token;
        const level = req.query.level;
        if (!(await UserManager.checkLogin(user, token))[0]) {
            res.sendStatus(401);
            return;
        }
        res.send(await UserManager.getCode(user, level));
    });
}
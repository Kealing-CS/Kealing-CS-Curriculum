module.exports = function ({app, UserManager}) {
    app.post("/api/setCode", async function(req, res) {
        const user = req.body.user;
        const token = req.body.token;
        const level = req.body.level;
        const code = req.body.code;
        if (!await UserManager.checkLogin(user, token)) {
            res.sendStatus(401);
            return;
        }
        UserManager.setCode(user, level, code);
    });
}
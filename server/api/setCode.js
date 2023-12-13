module.exports = function ({app, UserManager}) {
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
}
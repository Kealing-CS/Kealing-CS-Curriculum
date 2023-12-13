module.exports = function ({app, UserManager}) {
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
}
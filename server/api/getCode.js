module.exports = function ({app, UserManager}) {
    app.get("/api/getCode", function(req, res) {
        const user = req.query.user;
        const token = req.query.token;
        const level = req.query.level;
        if (!UserManager.checkLogin(user, token)) {
            res.sendStatus(401);
            return;
        }
        res.send(UserManager.getCode(user, level));
    });
}
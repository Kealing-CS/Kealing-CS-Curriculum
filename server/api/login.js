module.exports = function ({app, UserManager}) {
    app.post("/api/login", function(req, res) {
        user = req.body.user;
        token = req.body.token;
        res.send(UserManager.checkLogin(user, token));
    });
}
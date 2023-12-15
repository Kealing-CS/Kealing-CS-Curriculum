module.exports = function ({app, UserManager}) {
    app.post("/api/login", function(req, res) {
        const user = req.body.user;
        const token = req.body.token;
        res.send(UserManager.checkLogin(user, token));
    });
}
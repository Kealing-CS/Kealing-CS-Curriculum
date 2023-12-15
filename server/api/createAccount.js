module.exports = function ({app, UserManager}) {
    app.post("/api/createAccount", function(req, res) {
        const user = req.body.user;
        password = req.body.password;
        res.send(UserManager.createAccount(user, password));
    });
}
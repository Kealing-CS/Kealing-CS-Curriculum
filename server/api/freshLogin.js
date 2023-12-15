module.exports = function ({app, UserManager}) {
    app.post("/api/freshLogin", function(req, res) {
        const user = req.body.user;
        password = req.body.password;
        
        res.send(UserManager.freshLogin(user, password));
    });
}
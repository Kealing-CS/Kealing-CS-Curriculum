module.exports = function ({app, UserManager}) {
    app.post("/api/login", async function(req, res) {
        const user = req.body.user;
        const token = req.body.token;
        res.send(await UserManager.checkLogin(user, token));
    });
}
module.exports = function ({app, UserManager}) {
    app.post("/api/login", async function(req, res) {
        const user = req.body.user;
        const token = req.body.token;

        if (!user) {
            res.sendStatus(418);
            return;
        }

        if (!token) {
            res.sendStatus(418);
            return;
        }

        res.send((await UserManager.checkLogin(user, token))[0]);
    });
}
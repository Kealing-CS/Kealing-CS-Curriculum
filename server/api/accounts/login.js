module.exports = function ({app, UserManager}) {
    app.get("/api/login", async function(req, res) {
        const user = req.cookies.username;
        const token = req.cookies.token;

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
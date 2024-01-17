module.exports = function ({app, UserManager}) {
    app.post("/api/ban", async function(req, res) {
        const username = req.body.username;
        const token = req.body.token;

        const user = req.body.user;
        const reason = req.body.reason;


        if (!(await UserManager.checkLogin(username, token))[0]) {
            res.status(401);
            return;
        }

        if (!await UserManager.isAdmin(username)) {
            res.status(401);
            return;
        }

        if (await UserManager.isBanned(user)) {
            res.status(409);
            return;
        }

        UserManager.ban(user, reason);

        res.status(200);
    });
}
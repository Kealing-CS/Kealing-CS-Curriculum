module.exports = function ({app, UserManager}) {
    app.get("/api/resetTeacherRequests", async function(req, res) {
        const username = req.cookies.username;
        const token = req.cookies.token;

        if (!(await UserManager.checkLogin(username, token))[0]) {
            res.status(401);
            return;
        }

        if (!await UserManager.isAdmin(username)) {
            res.status(401);
            return;
        }

        await UserManager.resetTeacherRequests();

        res.sendStatus(200);
    });
}
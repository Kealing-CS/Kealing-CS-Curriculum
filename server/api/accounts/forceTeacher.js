module.exports = function ({app, UserManager}) {
    app.post("/api/forceTeacher", async function(req, res) {
        const username = req.cookies.username;
        const token = req.cookies.token;

        const user = req.body.user;

        if (!(await UserManager.checkLogin(username, token))[0]) {
            res.status(401);
            return;
        }

        if (!await UserManager.isAdmin(username)) {
            res.status(401);
            return;
        }

        UserManager.forceTeacher(user);

        res.status(200);
    });
}
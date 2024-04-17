module.exports = function ({app, UserManager}) {
    app.get("/api/acceptTeacherRequest", async function(req, res) {
        const username = req.cookies.username;
        const token = req.cookies.token;

        const id = req.query.id;

        if (!(await UserManager.checkLogin(username, token))[0]) {
            res.status(401);
            return;
        }

        if (!await UserManager.isAdmin(username)) {
            res.status(401);
            return;
        }

        await UserManager.acceptTeacher(id);

        res.sendStatus(200);
    });
}
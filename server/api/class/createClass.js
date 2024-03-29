module.exports = function ({ app, UserManager }) {
    app.post("/api/createClass", async function (req, res) {
        const user = req.cookies.username;
        const token = req.cookies.token;

        const name = req.body.name;

        if (!await UserManager.checkLogin(user, token)) {
            res.sendStatus(401);
            return;
        }

        if (!await UserManager.isTeacher(user)) {
            res.sendStatus(403);
            return;
        }

        await UserManager.createClass(user, name);

        res.sendStatus(200);
    });
}
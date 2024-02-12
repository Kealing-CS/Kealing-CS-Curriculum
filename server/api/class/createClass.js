module.exports = function ({ app, UserManager }) {
    app.post("/api/createClass", function (req, res) {
        const user = req.cookies.username;
        const token = req.cookies.token;

        if (UserManager.checkLogin(user, token)) {
            res.sendStatus(401);
            return;
        }

        if (!UserManager.isTeacher(user)) {
            res.sendStatus(403);
            return;
        }

        res.sendStatus(200);
    });
}
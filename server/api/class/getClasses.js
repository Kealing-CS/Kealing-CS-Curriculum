module.exports = function ({ app, UserManager }) {
    app.get("/api/getClasses", async function(req, res) {
        const user = req.cookies.username;
        const token = req.cookies.token;

        if (!UserManager.checkLogin(user, token)) {
            res.sendStatus(401);
            return;
        }

        if (!UserManager.isTeacher(user) && !UserManager.isAdmin(user)) {
            res.sendStatus(403);
            return;
        }

        let classes = await UserManager.getClasses(user);

        if (!classes) {
            res.send([]);
            return;
        }

        res.send(classes);
    });
}
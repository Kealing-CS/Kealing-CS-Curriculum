module.exports = function ({app, UserManager, LevelManager}) {
    app.post("/api/deleteLevel", async function(req, res) {
        const user = req.cookies.username;
        const token = req.cookies.token;
        const id = req.body.id;

        if (!UserManager.isAdmin(user)) {
            res.sendStatus(403);
            return;
        }

        if (!(await UserManager.checkLogin(user, token))[0]) {
            res.sendStatus(401);
            return;
        }

        if (!await LevelManager.levelExists(id)) {
            res.sendStatus(404);
            return;
        }

        LevelManager.deleteLevel(id);

        res.sendStatus(200);
    });
}
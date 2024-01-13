module.exports = function ({app, UserManager, LevelManager}) {
    app.post("/api/setLevel", async function(req, res) {
        const user = req.body.user;
        const token = req.body.token;
        const data = req.body.data;

        if (
            !data.id || !data.name              ||
            !data.parents || !data.instructions ||
            !data.needs || !data.baseCode       ||
            !data.correctLogs || !data.position
        ) {
            res.sendStatus(400);
            return;
        }

        if (!await UserManager.checkLogin(user, token)) {
            res.sendStatus(401);
            return;
        }

        if (!UserManager.isAdmin(user)) {
            res.sendStatus(403);
            return;
        }

        LevelManager.setLevel(
            data.id,
            data.name,
            data.parents,
            data.instructions,
            data.needs,
            data.baseCode,
            data.correctLogs,
            data.position
        );

        res.sendStatus(200);
    });
}
module.exports = function ({app, UserManager, LevelManager}) {
    app.post("/api/setLevel", async function(req, res) {
        const user = req.cookies.user;
        const token = req.cookies.token;
        const data = req.body.data;

        if (
            !data.id||!data.name                ||
            !data.parents || !data.instructions ||
            !data.baseCode || !data.correctLogs ||
            !data.position
        ) {
            res.sendStatus(400);
            return;
        }

        if (typeof data.id !== "string") {
            res.sendStatus(400);
            return;
        }

        if (!(await UserManager.checkLogin(user, token))[0]) {
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
            data.baseCode,
            data.correctLogs,
            data.position
        );

        res.sendStatus(200);
    });
}
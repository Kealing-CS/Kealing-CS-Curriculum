module.exports = function ({app, UserManager}) {
    app.get("/api/getCompleted", async function(req, res) {
        const user = req.query.user;

        if (!await UserManager.exists(user)) {
            res.sendStatus(404);
            return;
        }
        res.send(await UserManager.getCompleted(user));
    });
}
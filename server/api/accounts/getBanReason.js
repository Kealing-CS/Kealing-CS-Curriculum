module.exports = function ({app, UserManager}) {
    app.get("/api/getBanReason", async function(req, res) {
        const user = req.query.user;

        if (!await UserManager.isBanned(user)) {
            res.status(409);
            return;
        }

        res.send(await UserManager.getBanReason(user));
    });
}
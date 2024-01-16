module.exports = function ({app, UserManager}) {
    app.get("/api/isBanned", async function(req, res) {
        const user = req.query.user;
        res.send(await UserManager.isBanned(user));
    });
}
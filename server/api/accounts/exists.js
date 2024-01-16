module.exports = function ({app, UserManager}) {
    app.get("/api/exists", async function(req, res) {
        const user = req.query.user;
        res.send(await UserManager.exists(user));
    });
}
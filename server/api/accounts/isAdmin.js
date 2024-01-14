module.exports = function ({app, UserManager}) {
    app.get("/api/isAdmin", async function(req, res) {
        const user = req.query.user;
        res.send(await UserManager.isAdmin(user));
    });
}
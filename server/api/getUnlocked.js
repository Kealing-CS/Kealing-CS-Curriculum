module.exports = function ({app, UserManager}) {
    app.get("/api/getUnlocked", async function(req, res) {
        const user = req.query.user;
        res.send(await UserManager.getUnlocked(user));
    });
}
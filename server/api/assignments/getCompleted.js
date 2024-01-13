module.exports = function ({app, UserManager}) {
    app.get("/api/getCompleted", async function(req, res) {
        const user = req.query.user;
        res.send(await UserManager.getCompleted(user));
    });
}
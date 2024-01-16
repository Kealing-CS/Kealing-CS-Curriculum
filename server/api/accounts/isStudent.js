module.exports = function ({app, UserManager}) {
    app.get("/api/isStudent", async function(req, res) {
        const user = req.query.user;
        res.send(await UserManager.isStudent(user));
    });
}
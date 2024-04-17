module.exports = function ({app, UserManager}) {
    app.get("/api/isTeacher", async function(req, res) {
        const user = req.query.user;
        res.send(await UserManager.isTeacher(user));
    });
}
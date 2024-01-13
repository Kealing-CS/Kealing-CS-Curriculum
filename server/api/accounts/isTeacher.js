module.exports = function ({app, UserManager}) {
    app.get("/api/isTeacher", async function(req, res) {
        const user = req.body.user;
        res.send(await UserManager.isTeacher(user));
    });
}
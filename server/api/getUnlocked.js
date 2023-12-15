module.exports = function ({app, UserManager}) {
    app.get("/api/getUnlocked", function(req, res) {
        const user = req.query.user;
        res.send(UserManager.getUnlocked(user));
    });
}
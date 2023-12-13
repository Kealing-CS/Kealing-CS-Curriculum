module.exports = function ({app, UserManager}) {
    app.get("/api/getCompleted", function(req, res) {
        user = req.query.user;
        res.send(UserManager.getCompleted(user));
    });
}
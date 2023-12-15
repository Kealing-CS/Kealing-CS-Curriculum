module.exports = function ({app, UserManager}) {
    app.get("/api/getCompleted", function(req, res) {
        const user = req.query.user;
        res.send(UserManager.getCompleted(user));
    });
}
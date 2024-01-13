module.exports = function ({app, UserManager}) {
    app.get("/api/joinClass", function(req, res) {
        const user = req.query.user;
        const token = req.query.token;
        classCode = req.query.classCode;

        if (UserManager.checkLogin(user, token)) {
            res.sendStatus(401);
            return;
        }

        if (!UserManager.isTeacher(user)) {
            res.sendStatus(403);
            return;
        }

        if (!UserManager.joinClass(user, classCode)) {
            res.sendStatus(404);
            return;
        }
        
        res.sendStatus(200);
    });
}
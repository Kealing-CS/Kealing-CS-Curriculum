module.exports = function ({app, UserManager}) {
    app.post("/api/joinClass", function(req, res) {
        const user = req.cookies.username;
        const token = req.cookies.token;

        const classCode = req.body.classCode;

        if (!UserManager.checkLogin(user, token)) {
            res.sendStatus(401);
            return;
        }

        if (!UserManager.isTeacher(user) && !UserManager.isAdmin(user)) {
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
module.exports = function ({app, UserManager}) {
    app.post("/api/requestTeacher", async function(req, res) {
        const username = req.cookies.username;
        const token = req.cookies.token;

        const school = req.body.school;
        const email = req.body.email;


        if (!(await UserManager.checkLogin(username, token))[0]) {
            res.sendStatus(401);
            return;
        }

        if (await UserManager.isTeacher(username)) {
            res.sendStatus(409);
            return;
        }

        if (await UserManager.hasTeacherRequest(username)) {
            res.sendStatus(409);
            return;
        }

        UserManager.requestTeacher(username, school, email);

        res.sendStatus(200);
    });
}
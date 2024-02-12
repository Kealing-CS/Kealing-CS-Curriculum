module.exports = function ({app, UserManager}) {
    app.post("/api/requestTeacher", async function(req, res) {
        const username = req.body.username;
        const token = req.body.token;

        const school = req.body.school;
        const email = req.body.email;


        if (!(await UserManager.checkLogin(username, token))[0]) {
            res.status(401);
            return;
        }

        if (await UserManager.isTeacher(username)) {
            res.status(409);
            return;
        }

        UserManager.requestTeacher(username, school, email);

        res.status(200);
    });
}
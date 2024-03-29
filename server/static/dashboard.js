module.exports = function ({app, getStatic, UserManager, banned}) {
    app.get('/dashboard', async function(req, res) {
        const username = req.cookies.username;
        const token = req.cookies.token;

        if (!username || !token) {
            res.redirect(`/login?redirect=/dashboard${req._parsedUrl.search || ""}`);
            return;
        }

        if (!(await UserManager.checkLogin(username, token))[0]) {
            res.redirect(`/login?redirect=/dashboard${req._parsedUrl.search || ""}`);
            return;
        }

        if (await banned({UserManager, getStatic, res, username})) {
            return;
        }

        if (await UserManager.isAdmin(username)) {
            res.sendFile(getStatic('docs/adminDashboard.html'));
            return;
        }

        if (await UserManager.isTeacher(username)) {
            res.sendFile(getStatic('docs/teacherDashboard.html'));
            return;
        }

        res.sendFile(getStatic('docs/studentDashboard.html'));
    });
}
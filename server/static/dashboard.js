module.exports = function ({app, getStatic, UserManager}) {
    app.get('/dashboard', async function(req, res) {
        const username = req.cookies.username;
        const token = req.cookies.token;

        if (!username || !token) {
            res.redirect('/login');
            return;
        }

        if (!await UserManager.checkLogin(username, token)) {
            res.redirect('/login');
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
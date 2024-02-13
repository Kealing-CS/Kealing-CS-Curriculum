module.exports = function ({app, getStatic, UserManager, banned}) {
    app.get('/joinclass', async function(req, res) {
        if (!username || !token) {
            res.redirect(`/login?redirect=/joinclass${req._parsedUrl.search || ""}`);
            return;
        }

        if (!(await UserManager.checkLogin(username, token))[0]) {
            res.redirect(`/login?redirect=/joinclass${req._parsedUrl.search || ""}`);
            return;
        }

        if (await banned({UserManager, getStatic, res, username})) {
            return;
        }

        res.sendFile(getStatic('docs/joinclass.html'));
    });
}
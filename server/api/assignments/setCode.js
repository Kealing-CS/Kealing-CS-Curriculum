module.exports = function ({app, UserManager}) {
    app.post("/api/setCode", async function(req, res) {
        const user = req.cookies.username;
        const token = req.cookies.token;
        
        const level = req.body.level;
        const code = req.body.code;
        if (!(await UserManager.checkLogin(user, token))[0]) {
            res.sendStatus(401);
            return;
        }
        UserManager.setCode(user, level, code);
        res.sendStatus(200);
    });
}
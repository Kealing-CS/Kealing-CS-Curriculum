module.exports = function ({app, UserManager}) {
    app.post("/api/freshLogin", async function(req, res) {
        const user = req.body.user;
        const password = req.body.password;

        if (!(await UserManager.exists(user))) {
            res.send([false, "username does not exist"]);
            return;
        }

        if (!(await UserManager.checkPassword(user, password))) {
            res.send([false, "password is incorrect"]);
            return;
        }
        
        let tn = await UserManager.freshLogin(user, password);

        res.send([true, tn]);
    });
}
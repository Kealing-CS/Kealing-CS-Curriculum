module.exports = function ({app, UserManager}) {
    app.post("/api/freshLogin", async function(req, res) {
        const user = req.body.user;
        password = req.body.password;
        
        let tn = await UserManager.freshLogin(user, password);

        if (!tn[0]) {
            res.send(tn);
            return;
        }

        res.send(tn);
    });
}
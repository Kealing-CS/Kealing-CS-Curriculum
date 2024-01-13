module.exports = function ({app, UserManager}) {
    app.post("/api/createAccount", async function(req, res) {
        const user = req.body.user;
        password = req.body.password;
        res.send(await UserManager.createAccount(user, password));
    });
}
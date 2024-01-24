module.exports = function ({app, UserManager}) {
    app.get("/api/getCode", async function(req, res) {
        const user = req.query.user;
        const token = req.query.token;
        const level = req.query.level;
        const response_um = await UserManager.checkLogin(user, token)
        
        // I have zero idea why this snippet doesn't work even though it's the same thing??????
        // Probably some weird delay thing
        // if (!((await UserManager.checkLogin(user, token)[0]))) {

        if (!(response_um[0])) {
            res.sendStatus(401);
            return;
        }
        res.send(await UserManager.getCode(user, level));
    });
}
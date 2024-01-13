module.exports = function ({app, LevelManager}) {
    app.get("/api/getBaseCode", async function(req, res) {
        const level = req.query.level;
        if (!await LevelManager.levelExists(level)) {
            res.sendStatus(404);
            return;
        }
    res.send(await LevelManager.getBaseCode(level));
    });
}
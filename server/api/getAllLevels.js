module.exports = function ({app, LevelManager}) {
    app.get("/api/getAllLevels", async function(req, res) {
        res.send(await LevelManager.getAll());
    });
}
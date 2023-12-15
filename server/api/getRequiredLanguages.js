module.exports = function ({app, LevelManager}) {
    app.get("/api/getRequiredLanguages", function(req, res) {
        const level = req.query.level;
        if (!LevelManager.levelExists(level)) {
            res.sendStatus(404);
            return;
        }
        res.send(LevelManager.getRequiredLanguages(level));
    });
}
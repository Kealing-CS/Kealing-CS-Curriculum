const fs = require('fs');

module.exports = function ({app, LevelManager}) {
    app.get("/api/getAllLevels", async function(req, res) {
        let cur = await LevelManager.getAll();
        res.json(cur);
    });
}
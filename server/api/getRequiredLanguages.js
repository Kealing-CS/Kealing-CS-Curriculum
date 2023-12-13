module.exports = function ({app, levelinfo}) {
    app.get("/api/getRequiredLanguages", function(req, res) {
        const level = req.query.level;
        if (!levelinfo[level]) {
            res.sendStatus(404);
            return;
        }
        res.send(levelinfo[level]["needs"])
    });
}
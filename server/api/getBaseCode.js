module.exports = function ({app, levelinfo}) {
    app.get("/api/getBaseCode", function(req, res) {
        level = req.query.level;
        res.send(levelinfo[level]["baseCode"]);
    });
}
module.exports = function (app, db) {
    app.post("/api/run", function(req, res) {
        // should run code (sandboxed obv) and check if it works. Save to db the code and the result. Return the result
        res.send(418)
    })

    app.get("/api/getLessons", function(req, res) {
        user = req.query.user;
        // should return all the lessons that the user has unlocked
        res.send('{"lessons": ["start", "js"]}')
    })
}
module.exports = function (app) {
    

    app.post("/api/submit", function(req, res) {
        // Save the code to the db (once made)
        const code = req.body.code;
    })

    app.get("/api/getLessons", function(req, res) {
        user = req.query.user;
        // should return all the lessons that the user has unlocked
        res.send('{"lessons": ["start", "js"]}')
    })
}
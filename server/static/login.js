module.exports = function ({app, getStatic}) {
    app.get('/login', function(req, res) {
        res.sendFile(getStatic('docs/login.html'));
    });
}
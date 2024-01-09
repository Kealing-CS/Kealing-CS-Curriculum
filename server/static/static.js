module.exports = function ({app, getStatic}) {
    app.get('/static/*', function(req, res) {
        res.sendFile(getStatic(req.params[0]));
    });
}
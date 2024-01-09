module.exports = function ({app, getStatic}) {
    app.get('/ide', function(req, res) {
        res.sendFile(getStatic('docs/IDE.html'));
        //res.redirect('/login');
    });
}
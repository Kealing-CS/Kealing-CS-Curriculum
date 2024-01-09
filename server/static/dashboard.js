module.exports = function ({app, getStatic}) {
    app.get('/dashboard', function(req, res) {
        res.sendFile(getStatic('docs/index.html'));
        //res.redirect('/login');
    });
}
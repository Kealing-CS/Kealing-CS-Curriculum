module.exports = function ({app, getStatic}) {
    app.get('/dashboard', function(req, res) {
        res.sendFile(getStatic('docs/dashboard.html'));
        //res.redirect('/login');
    });
}
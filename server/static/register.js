module.exports = function ({app, getStatic}) {
    app.get('/register', function(req, res) {
        res.sendFile(getStatic('docs/register.html'));
        //res.redirect('/login');
    });
}
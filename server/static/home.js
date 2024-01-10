module.exports = function ({app, getStatic}) {
    app.get('/', function(req, res) {
        res.sendFile(getStatic('docs/home.html'));
        //res.redirect('/login');
    });
}
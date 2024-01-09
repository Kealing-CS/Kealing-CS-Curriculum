module.exports = function ({app, getStatic}) {
    app.get('/joinclass', function(req, res) {
        res.sendFile(getStatic('docs/joinclass.html'));
        //res.redirect('/login');
    });
}
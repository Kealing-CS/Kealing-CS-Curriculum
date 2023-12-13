const getStatic = require('./_getStatic');

module.exports = function (app) {
    app.get('/joinclass', function(req, res) {
        res.sendFile(getStatic('docs/joinclass.html'));
        //res.redirect('/login');
    });
}
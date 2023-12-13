const getStatic = require('./_getStatic');

module.exports = function (app) {
    app.get('/ide', function(req, res) {
        res.sendFile(getStatic('docs/IDE.html'));
        //res.redirect('/login');
    });
}
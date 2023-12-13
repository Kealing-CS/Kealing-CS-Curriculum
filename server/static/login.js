const getStatic = require('./_getStatic');

module.exports = function (app) {
    app.get('/login', function(req, res) {
        res.sendFile(getStatic('docs/login.html'));
        //res.redirect('/login');
    });
}
const getStatic = require('./_getStatic');

module.exports = function (app) {
    app.get('/register', function(req, res) {
        res.sendFile(getStatic('docs/register.html'));
        //res.redirect('/login');
    });
}
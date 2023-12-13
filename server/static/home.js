const getStatic = require('./_getStatic');

module.exports = function (app) {
    app.get('/', function(req, res) {
        res.sendFile(getStatic('docs/index.html'));
        //res.redirect('/login');
    });
}
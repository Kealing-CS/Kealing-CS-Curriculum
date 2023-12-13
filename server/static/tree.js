const getStatic = require('./_getStatic');

module.exports = function (app) {
    app.get('/tree', function(req, res) {
        res.sendFile(getStatic('docs/tree.html'));
        //res.redirect('/login');
    });
}
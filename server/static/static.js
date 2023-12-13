const getStatic = require('./_getStatic');

module.exports = function (app) {
    app.get('/static/*', function(req, res) {
        res.sendFile(getStatic(req.params[0]));
    });
}
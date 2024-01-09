module.exports = function ({app, getStatic}) {
    app.get('/tree', function(req, res) {
        res.sendFile(getStatic('docs/tree.html'));
    });
}
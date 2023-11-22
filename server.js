var express = require('express');
var path = require('path');
var cors = require('cors');

var app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
   res.sendFile(path.join(__dirname, 'docs', 'lesson_page.html'));
});

app.get("/static/css/:file", function(req, res) {
    res.sendFile(path.join(__dirname, 'static/css', req.params.file));
});

app.get("/static/js/:file", function(req, res) {
    res.sendFile(path.join(__dirname, 'static/js', req.params.file));
});

app.listen(8008);
var express = require('express');
var path = require('path');
var cors = require('cors');

var app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
   res.sendFile(path.join(__dirname, 'docs', 'lesson_page.html'));
});

app.get("/static/*", function(req, res) {
    res.sendFile(path.join(__dirname, 'static', req.params['0']));
})

app.post("/api/run", function(req, res) {
    // should run code (sandboxed obv) and check if it works. Save to db the code and the result. Return the result

})

app.listen(8008);
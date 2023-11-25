var express = require('express');
var path = require('path');
var cors = require('cors');
var staticFiles = require('./staticFiles.js');
var api = require('./api.js');

var app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

staticFiles(app);
api(app);

app.listen(8008);
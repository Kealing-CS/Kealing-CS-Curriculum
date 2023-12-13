var express = require('express');
var path = require('path');
var cors = require('cors');
var staticFiles = require('./static/staticFiles.js');
var api = require('./api/api.js');
var fs = require('fs')
const ip = require('ip');
const port = 8008;

// Creates sensative.json if it does not exist
fs.writeFile('./db/sensative.json', "{}", { flag: 'wx' }, function (err) {
    if (err) { console.log("sensative.json already exists") } else { console.log("sensative.json created") };
});
fs.writeFile('./db/userdata.json', "{}", { flag: 'wx' }, function (err) {
    if (err) { console.log("userdata.json already exists") } else { console.log("sensative.json created") };
});

var app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

staticFiles(app);
api(app);

app.listen(port, () => {
    console.log(`Server running on http://${ip.address()}:${port}/`);
    console.log(`or use http://localhost:${port}/`)
});

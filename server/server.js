var express = require('express');
var path = require('path');
var cors = require('cors');
var staticFiles = require('./static/staticFiles.js');
var api = require('./api/api.js');
var fs = require('fs')
const ip = require('ip');
const port = 8008;


if (process.argv.indexOf("--reset") > -1 || process.argv.indexOf("-R") > -1) {
    console.log("Resetting database...")
    fs.writeFileSync('./db/sensitivedata.db', '')
    fs.writeFileSync('./db/userdata.db', '')
    console.log("Done!")
}

// Creates sensitivedata.db and userdata.db if it does not exist
if (!fs.existsSync('./db/sensitivedata.db')) {
    fs.writeFileSync('./db/sensitivedata.db', '')
}
if (!fs.existsSync('./db/userdata.db')) {
    fs.writeFileSync('./db/userdata.db', '')
}

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

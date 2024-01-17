const express = require('express');
const path = require('path');
const cors = require('cors');
const staticFiles = require('./static/staticFiles.js');
const cookieParser = require("cookie-parser");
const api = require('./api/api.js');
const fs = require('fs')
const ip = require('ip');
const port = 8008;


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

app.use(cookieParser());


staticFiles(app);
api(app);

app.listen(port, () => {
    console.log(`Server running on http://${ip.address()}:${port}/`);
    console.log(`or use http://localhost:${port}/`)
});
const express = require('express');
const path = require('path');
const cors = require('cors');
const staticFiles = require('./static/staticFiles.js');
const cookieParser = require("cookie-parser");
const api = require('./api/api.js');
const fs = require('fs')
const ip = require('ip');
const rateLimiter = require('express-rate-limit');
const port = 8008;


// make sure all the gitignore shit exists
if (!fs.existsSync('./db/sensitivedata.db')) {
    fs.writeFileSync('./db/sensitivedata.db', '')
}
if (!fs.existsSync('./db/userdata.db')) {
    fs.writeFileSync('./db/userdata.db', '')
}
if (!fs.existsSync('./db/classes.db')) {
    fs.writeFileSync('./db/classes.db', '')
}
if (!fs.existsSync('./db/admins.json')) {
    fs.writeFileSync('./db/admins.json', '[]')
}

let app = express();

// rate limiter
const limit = rateLimiter.rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes in milliseconds
    max: 300, // Limit each IP to 30 requests per minute
    message: 'Too many requests from this IP, please try again after 10 minutes'
});

// cors
app.use(cors());

// for parsing json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for cookies
app.use(cookieParser());


staticFiles(app);
api(app);

app.listen(port, () => {
    console.log(`Server running on http://${ip.address()}:${port}/`);
    console.log(`or use http://localhost:${port}/`)
});
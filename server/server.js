const express = require('express');
const path = require('path');
const cors = require('cors');
const staticFiles = require('./static/staticFiles.js');
const cookieParser = require("cookie-parser");
const api = require('./api/api.js');
const fs = require('fs');
const rateLimiter = require('express-rate-limit');
const port = 8008;
const listen = require("./https.js").listen;
// this is the server
// (wowza)


// make sure all the gitignore junk exists
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
if (!fs.existsSync('./db/tasks.json')){
    fs.writeFileSync('./db/tasks.json', '[]')
}
let app = express();

// rate limiter
const limit = rateLimiter.rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes in milliseconds
    limit: 500, // Limit each IP to 500 requests per minute
    message: 'Too many requests from this IP, please try again after 10 minutes'
});

// cors
app.use(cors());

//Rate limit
app.use(limit);
// for parsing json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for cookies
app.use(cookieParser());


staticFiles(app);
api(app);

// 404
app.all('*', async (req, res) => {
    res.status(404);

    res.sendFile(path.join(__dirname, `../static/docs/404.html`));
});
listen(app,port, async () => {
    let ip = await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(res => res.ip);
    console.log(`Server running at https://${ip}:${port}/`)
    console.log(`or use https://localhost:${port}/`)
});
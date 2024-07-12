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
const tasks = require("./tasks.js");
const vm = require("vm");
var optionsPaths = {
    key: "./server/certificates/key.pem",
    cert: "./server/certificates/cert.pem",
  };
function genarateOptions() {
 var keys = Object.keys(optionsPaths),
    values = Object.values(optionsPaths).map((val, i) => fs.readFileSync(val)),
    output = {};
  values.forEach((item, i) => {
    output[keys[i]] = item;
  });
  return output;
}
module.exports.start = function() {
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
if (!fs.existsSync("./server/certificates")){
    fs.mkdirSync("./server/certificates");
}
if(!(fs.existsSync('./server/certificates/cert.pem') && fs.existsSync('./server/certificates/key.pem'))){
    require('./genarateCert.js')({refresh:()=>{}});
}

let app = express();

// rate limiter
const limit = rateLimiter.rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes in milliseconds
    limit: 500, // Limit each IP to 500 requests per minute
    message: 'Too many requests from this IP, please try again after 5 minutes'
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
return new Promise((resolve,reject) => {
    listen(app,genarateOptions(),port, async (serverInstance ) => {
        // Get all ips of computer
        let ips = Object.values(require("os").networkInterfaces()).flat(2).filter(val => !val.internal && val.address).map(val => (val.family == "IPv6" ? `[${val.address}]` : val.address));
        ips.forEach((ip,i) => {console.log(`${i == 0 ? "Server running at " : ""}https://${ip}:${port}/${i < (ips.length - 2) ? "," : (i == (ips.length - 1) ? "" : " and")}`)});
        console.log(`or use https://localhost:${port}/`);
        // Start tasks
        tasks.listen({serverInstance,require,console});
        resolve(serverInstance);
    });
});
}
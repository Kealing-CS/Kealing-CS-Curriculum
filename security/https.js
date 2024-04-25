var https = require("https");
var http = require("http");
var fs = require("fs");
module.exports.listen = function(app,port,callbackFunction){
var server = https.createServer({key:fs.readFileSync("./certificates/key.pem"),cert:fs.readFileSync("./certificates/cert.pem")},app);
server.listen(port,callbackFunction);
}
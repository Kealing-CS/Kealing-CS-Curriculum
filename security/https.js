var https = require("https");
var http = require("http");
var net = require("net");
var fs = require("fs");
module.exports.listen = function(app,port,callbackFunction){
var server = https.createServer({key:fs.readFileSync("./security/certificates/key.pem"),cert:fs.readFileSync("./security/certificates/cert.pem")},app);
var tcpserver = net.createServer();
tcpserver.listen(port);
tcpserver.on("connection",(socket) => {
socket.once("data", (data) => {
 http._connectionListener.call(server, socket);
 socket.emit("data",data);
});
});
//server.listen(port,callbackFunction);
}
var https = require("https");
var tls = require("tls");
var http = require("http");
//var { storeHTTPOptions } = require("_http_server.js")
var ser = require("_http_server");
var net = require("net");
var fs = require("fs");
module.exports.listen = function (app, port, callbackFunction) {
 var options = {
   key: fs.readFileSync("./security/certificates/key.pem"),
   cert: fs.readFileSync("./security/certificates/cert.pem"),
 };
var tcpserver = net.createServer();
var server = https.createServer(options,app);
 tcpserver.listen(port);
 callbackFunction();
 tcpserver.on("connection", (socket) => {
    var sock = new tls.TLSSocket(socket, {  isServer: true,...options });
    http._connectionListener.call(server,sock);
    return
   console.log("connect");
   socket.once("data", (data) => {
     console.log("data");
     if (data[0] === 22) {
       //https
     }else{
        http._connectionListener.call(server,socket);
        socket.emit("data", data);
     }
    
    
});
 });
 //server.listen(port,callbackFunction);
};


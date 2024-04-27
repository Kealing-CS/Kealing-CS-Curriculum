var https = require("https");
var tls = require("tls");
var http = require("http");
var ser = require("_http_server");
var net = require("net");
var fs = require("fs");
module.exports.listen = function (app, port, callbackFunction) {
 var options = {
   key: fs.readFileSync("./security/certificates/key.pem").toString(),
   cert: fs.readFileSync("./security/certificates/cert.pem").toString(),
 };
 var server = https.createServer(options, app);
 var tcpserver = net.createServer();
 tcpserver.listen(port);
 callbackFunction();
 tcpserver.on("connection", (socket) => {
   console.log("connect");
   socket.once("data", (data) => {
     console.log("data");
     if (data[0] === 22) {
        var context = tls.createSecureContext(options);
       //https
       /*var tserver = tls.TLSSocket.call(server,{
        noDelay: true,
        // http/1.0 is not defined as Protocol IDs in IANA
        // https://www.iana.org/assignments/tls-extensiontype-values
        //       /tls-extensiontype-values.xhtml#alpn-protocol-ids
        ALPNProtocols: ['http/1.1'],
        ...options,
      })*/
       var tserver = new tls.TLSSocket(socket, {
         isServer: true,
         noDelay: true,
         // http/1.0 is not defined as Protocol IDs in IANA
         // https://www.iana.org/assignments/tls-extensiontype-values
         //       /tls-extensiontype-values.xhtml#alpn-protocol-ids
         ALPNProtocols: ["http/1.1"],
        context
       });
       http._connectionListener(server,tserver);
      // tserver.emit('secureConnection', );
       tserver.write("ping");

       socket.emit("data", data);
     }
    
     /*
     Function.prototype.call(
       tls.Server,
       server,
       {
         noDelay: true,
         // http/1.0 is not defined as Protocol IDs in IANA
         // https://www.iana.org/assignments/tls-extensiontype-values
         //       /tls-extensiontype-values.xhtml#alpn-protocol-ids
         ALPNProtocols: ["http/1.1"],
         ...options,
       },
       http._connectionListener
     );*/
     socket.emit("data", data);
   });
 });
 //server.listen(port,callbackFunction);
};


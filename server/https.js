var https = require("https");
var tls = require("tls");
var http = require("http");
var net = require("net");
var fs = require("fs");
module.exports.listen = function (app, port, callbackFunction) {
  var options = {
    key: fs.readFileSync("./server/certificates/key.pem"),
    cert: fs.readFileSync("./server/certificates/cert.pem"),
  };
  var tcpserver = net.createServer();
  var server = https.createServer(options, app);
  var redirectServer = https.createServer(options, function (req, res) {
    res.writeHead("302", { location: `https://${req.headers.host + req.url}` });
    res.end();
  });
  tcpserver.listen(port);
  tcpserver.on("listening",callbackFunction);
  tcpserver.on("connection", (socket) => {
    var chunks = [];
    var reade = new (require("events"))();
    reade.emited = false;
    socket.on("readable", () => {
      var chunk;
      while (null !== (chunk = socket.read())) {
        chunks.push(chunk);
      }
      reade.emited = true;
      reade.emit("readable");
    });

    socket.once("data", (data) => {
      if (data[0] === 22) {
        //https
        var sock = new tls.TLSSocket(socket, { isServer: true, ...options });
        http._connectionListener.call(server, sock);
        // Tls sockets extend net socket, meaning I can't refire the eventEmiter to pass it the data.
        if (reade.emited) {
          chunks.forEach((d) => socket.push(d, "binary"));
        } else {
          reade.on("readable", () => {
            chunks.forEach((d) => socket.push(d, "binary"));
          });
        }
      } else {
        // Http
        http._connectionListener.call(redirectServer, socket);
        // Http views the events, meaning I can just refire the eventEmiter
        socket.emit("data", data);
      }
    });
  });
};

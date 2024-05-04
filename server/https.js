var https = require("https");
var tls = require("tls");
var http = require("http");
var net = require("net");
var fs = require("fs");
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
module.exports.listen = function (app, port, callbackFunction) {
  var options = genarateOptions();
  var tcpserver = net.createServer();
  var server = https.createServer(options, app);
  var redirectServer = https.createServer(options, function (req, res) {
    res.writeHead("302", { location: `https://${req.headers.host + req.url}` });
    res.end();
  });
  tcpserver.listen(port);
  tcpserver.on("listening", (listener) =>
    callbackFunction(
      listener,
      new (class serverInstance {
        async kill() {
          return await new Promise((resolve, fail) => {
            tcpserver.close((err) =>
              typeof err == "undefined"
                ? () => {
                    server.closeAllConnections();
                    redirectServer.closeAllConnections();
                    resolve();
                  }
                : fail(err)
            );
          });
        }
        refresh() {
          options = genarateOptions();
        }
      })()
    )
  );
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

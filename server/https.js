const tls = require("tls");
const http = require("http");
const net = require("net");
//I use the word "proxy" but it doesn't create an additional request, it directly passes the data to the https server after decrypting it, essentially the same as what is internaly done inside the http module.
/**
 * Create a https server that redirects all http requests on the same port to it.
 * @param app Http request listener
 * @param options Https options
 * @param port The port to host to
 * @param callbackFunction A callback for whan the server has started
 */
module.exports.listen = function listen(app, options, port, callbackFunction) {
    // The tcp server that receves all the requests
    var tcpserver = net.createServer();
    // The normal server ( MUST be http or else it will try sorting the encription out itself and will fail in this configuration)
    // This is just as secure as the normal nodejs https server
    var server = http.createServer(options, app);
    // A server that redirect all the requests to http, you could have this be the normal server too.
    var redirectServer = http.createServer(options, function (req, res) {
        res.writeHead(302, { location: `https://${req.headers.host || "" + req.url}` });
        res.end();
    });
    // Make the proxy server listen
    tcpserver.listen(port);
    // Call the callback when the server is ready
    tcpserver.on("listening", () => callbackFunction(new (class serverInstance {
        /**
         * Kill the server
         * @returns A promise that resolves when the server ends
         */
        async kill() {
            return new Promise((resolve, fail) => {
                tcpserver.close((err) => (typeof err == "undefined"
                    ? () => {
                        server.closeAllConnections();
                        redirectServer.closeAllConnections();
                        resolve();
                    }
                    : () => {
                        fail(err);
                    })());
            });
        }
        /**
         * Change the server options
         * @param newOptions The new server options
         */
        refresh(newOptions) {
            options = newOptions;
            server = http.createServer(options, app);
        }
    })()));
    // Handle request
    tcpserver.on("connection", (socket) => {
        // Detect http or https/tls handskake
        socket.once("data", (data) => {
            // Buffer incomeing requests
            socket.cork();
            // Detect if the provided handshake data is TLS by checking if it starts with 22, which TLS always dose
            if (data[0] === 22) {
                // Https
                // You may use this socket as a TLS socket, meaning you can attach this to the same http server
                var sock = new tls.TLSSocket(socket, { isServer: true, ...options });
                // Add the TLS socket as a connection to the main http server
                server.emit("connection", sock);
                // Append data to start of data buffer
                socket.unshift(data);
            }
            else {
                // Http
                // Emit the socket to the redirect server
                redirectServer.emit("connection", socket);
                // Http views the events, meaning I can just refire the eventEmiter
                socket.emit("data", data);
            }
            // Resume socket
            socket.uncork();
        });
    });
}
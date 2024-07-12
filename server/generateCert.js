const cert = require("./newcert.js");
const fs = require("fs");
const os = require("os");
const tasks = require("./tasks.js");
/**
 * Function to get new certificates for website
 * @param serverInstance The server
 */
module.exports = function(serverInstance){
// Get current date
var today = new Date();
var mycert = new cert(
  // Get all ips to make the cert valid for
  Object.values(os.networkInterfaces())
    .flat(2)
    .filter((val) => !val.internal && val.address)
    .map((val) => val.address),
  // The domain name to make the cert valid for
  ["https://kealingcs.com"],
  // Date for cert
  {
    countryName: "US",
    ST: "Texas",
    CN: "Kealing",
    organizationName: "KealingCS",
    // When to make the cert expire
    Expration: {
      notBefore: new Date(),
      notAfter: new Date(today.setDate(today.getDate() + 360)),
    },
  }
).build();
// Create certificates dir if gitignore removed it
if(!fs.existsSync("./certificates")){
  fs.mkdirSync("./certificates")
}
// Upload certificates to certificates dir so they can be used
fs.writeFileSync("./server/certificates/cert.pem", mycert.certificate);
fs.writeFileSync("./server/certificates/key.pem", mycert.privateKey);
// Tell tasks to refrest the certificate 3 days before it expires
tasks.addListener("refreshCert",new Date(today.setDate(today.getDate() + 357)),"require('./generateCert.js')(serverInstance);");
// Refresh the server's certificate
serverInstance.refresh();
}
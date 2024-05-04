module.exports = function(serverInstance){
var cert = require("./newcert.js");
var fs = require("fs");
var os = require("os");
var tasks = require("./tasks.js");
var today = new Date();
var mycert = new cert(
  Object.values(os.networkInterfaces())
    .flat(2)
    .filter((val) => !val.internal && val.address)
    .map((val) => val.address),
  ["https://kealingcs.com"],
  {
    countryName: "US",
    ST: "Texas",
    CN: "Kealing",
    organizationName: "KealingCS",
    Expration: {
      notBefore: new Date(),
      notAfter: new Date(today.setDate(today.getDate() + 360)),
    },
  }
).build();
if(!fs.existsSync("./certificates")){
  fs.mkdirSync("./certificates")
}
fs.writeFileSync("./server/certificates/cert.pem", mycert.certificate);
fs.writeFileSync("./server/certificates/key.pem", mycert.privateKey);
tasks.addListener("refreshCert",new Date(today.setDate(today.getDate() + 357)),"require('./genarateCert.js')(serverInstance);");
serverInstance.refresh();
}
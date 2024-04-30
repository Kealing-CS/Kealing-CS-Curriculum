var cert = require("./newcert.js");
var fs = require("fs");
var os = require("os");
var today = new Date();
var mycert = new cert(
  Object.values(require("os").networkInterfaces())
    .flat(2)
    .filter((val) => !val.internal && val.address)
    .map((val) => val.address),
  ["https://kealingcs.com"],
  {
    countryName: "US",
    ST: "Texas",
    organizationName: "Kealing",
    Expration: {
      notBefore: new Date(),
      notAfter: new Date(today.setDate(today.getDate() + 10)),
    },
  }
).build();
if(!fs.existsSync("./certificates")){
  fs.mkdirSync("./certificates")
}
fs.writeFileSync("./certificates/cert.pem", mycert.certificate);
fs.writeFileSync("./certificates/key.pem", mycert.privateKey);

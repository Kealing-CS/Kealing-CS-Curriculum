var cert = require("./newcert.js");
var fs = require("fs");
var os = require("os");
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
      NotAfter: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    },
  }
).build();
fs.writeFileSync("./certificates/cert.pem", mycert.certificate);
fs.writeFileSync("./certificates/key.pem", mycert.privateKey);

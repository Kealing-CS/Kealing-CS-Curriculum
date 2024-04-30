const { underline } = require("colors");
var crypto = require("crypto");
var forge = require("node-forge");

module.exports = class certificate {
  ips;
  URIs;
  expration;
  options;
  #names = ["countryName", "organizationName"];
  #shortnames = ["C", "ST", "L", "CN"];
  /*
    Exsample options:
    {"countryName":"US","ST":"Texas","organizationName":"Kealing","Expration":{"notBefore":new Date(),"notAfter":new Date((new Date()).getTime() + 1000 * 60 * 60 * 24 * 10)}} (10 Days)
    */
  constructor(altIPs, altURIs, options) {
    this.ips = altIPs;
    this.URIs = altURIs;
    this.expration = options.Expration;
    //delete options.Expration;
    this.options = options;
  }
  sortoptions(options) {
    var keys = Object.keys(options);
    var result = [];
    keys.forEach((value, i) => {
      if (this.#names.includes(value) || this.#shortnames.includes(value)) {
        result.push({
          [this.#names.includes(value) ? "name" : "shortName"]: value,
          value: options[value],
        });
      }
    });
    return result;
  }
  build() {
    var rsakeys = forge.pki.rsa.generateKeyPair(2048);
    var certificate = forge.pki.createCertificate();
    var options = this.sortoptions(this.options);
    certificate.publicKey = rsakeys.publicKey;
    certificate.serialNumber = "01" + crypto.randomBytes(19).toString("hex");
    Object.keys(this.expration).forEach((val) => {
      certificate.validity[val] = new Date(this.expration[val]);
    });
    console.log(certificate.validity);
    certificate.setSubject(options);
    certificate.setIssuer(options);
    certificate.setExtensions([
      {
        name: "subjectAltName",
        altNames: [
          ...(this.URIs != undefined
            ? this.URIs.map((URI) => ({ type: 6, value: URI }))
            : []),
          ...(this.ips != undefined
            ? this.ips.map((IP) => ({ type: 7, ip: IP }))
            : []),
        ],
      },
    ]);
    certificate.sign(rsakeys.privateKey, forge.md.sha512.create());
    console.log(options);
    return {
      certificate: forge.pki.certificateToPem(certificate),
      privateKey: forge.pki.privateKeyToPem(rsakeys.privateKey),
    };
  }
};

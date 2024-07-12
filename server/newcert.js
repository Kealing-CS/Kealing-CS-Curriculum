const { underline } = require("colors");
var crypto = require("crypto");
var forge = require("node-forge");

module.exports = class certificate {
  ips;
  URIs;
  expration;
  options;
  #names = ["countryName", "stateOrProvinceName","commonName","organizationName","organizationalUnitName"];
  #shortnames = ["C", "ST", "CN","L"];
  /*
    Example options:
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
    // Create the rsa keys for verifying the certificate
    var rsakeys = forge.pki.rsa.generateKeyPair(2048);
    // Create a certificate builder objrct
    var certificate = forge.pki.createCertificate();
    var options = this.sortoptions(this.options);
    // Set the public key of the certificate
    certificate.publicKey = rsakeys.publicKey;
    certificate.serialNumber = "01" + crypto.randomBytes(19).toString("hex");
    Object.keys(this.expration).forEach((val) => {
      certificate.validity[val] = new Date(this.expration[val]);
    });
    // Set the subject of the certificate
    certificate.setSubject(options);
    // Set the issuer of the certificate ( In self-sigend certificates most often the subject)
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
    // Sign the certificate with the private key
    certificate.sign(rsakeys.privateKey, forge.md.sha512.create());
    return {
      certificate: forge.pki.certificateToPem(certificate),
      privateKey: forge.pki.privateKeyToPem(rsakeys.privateKey),
    };
  }
};

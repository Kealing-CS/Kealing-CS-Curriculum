var crypto = require("crypto");
var forge = require("node-forge");

module.exports = class certificate {
    ips;
    URIs;
    expration;
    options;
    #names = ["countryName", "organizationName"];
    #shortnames = ["ST"];
    /*
    Exsample options:
    {"countryName":"US","ST":"Texas","organizationName":"Kealing","Expration":{"notBefore":new Date(),"NotAfter":new Date((new Date()).getTime() + 1000 * 60 * 60 * 24 * 10)}} (10 Days)
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
                result.push({ [this.#names.includes(value) ? "name" : "shortName"]: value, "value": options[value] });
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
        console.log(certificate.validity)
        certificate.setSubject(options);
        certificate.setIssuer(options);
        // Todo: add alt names
        certificate.sign(rsakeys.privateKey);
        console.log(options);
        return { "certificate": forge.pki.certificateToPem(certificate), "privateKey": forge.pki.privateKeyToPem(rsakeys.privateKey) };
    }
}
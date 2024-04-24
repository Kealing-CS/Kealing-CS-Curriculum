var crypto = require("crypto");
var forge = require("node-forge");

module.exports = class certificate {
    ips;
    URIs;
    expiration;
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
        this.expiration = options.expiration;
        delete options.expiration;
        this.options = options;
    }
    sortoptions(options){
        var keys = Object.keys(options);
        var result = [];
        keys.forEach((value,i) => {
            if(this.#names.includes(value)){
            result.push({"name": value,"value":options[value]});
            }
        });
    }
    build() {
        var rsakeys = forge.pki.rsa.generateKeyPair(2048);
        var certificate = forge.pki.createCertificate();
        certificate.publicKey = rsakeys.publicKey;
        certificate.serialNumber = "01" + crypto.randomBytes(19).toString("hex");
        certificate.validity = this.expiration;

    }
}
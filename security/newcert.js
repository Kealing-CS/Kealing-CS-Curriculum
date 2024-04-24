var crypto = require("crypto");
var forge = require("node-forge");

module.exports = class certificate{
    ips;
    URIs;
    expiration;
    options;
    /*
    Exsample options:
    {"countryName":"US","ST":"Texas","organizationName":"Kealing","Expration":{"notBefore":new Date(),"NotAfter":new Date(new Date.getTime() + 1000 * 60 * 60 * 24 * 10)}} (10 Days)
    */
    constructor(altIPs,altURIs,options){
    this.ips = altIPs;
    this.URIs = altURIs;
    this.expiration = options.expiration;
    delete options.expiration;
    }
}
// For reviewing comments: A regex for comments /(\/\/.+)|(\/\*[\S\s]*?\*\/)/gm
const { QuickDB } = require("quick.db");
// For aes
const aes = require("./aes.js");
// For hashing
const crypto = require("crypto");
// For createing database
const fs = require("fs");
// For hashing passwords.
const bcrypt = require("bcrypt");
// For cool colors
require("colors");
// For prompts
const readline = require("readline/promises");

/**
 * @typedef {{writable:string[] | "*",readonly:string[] | "*"} | "*"} premissionsStructure
 */
module.exports = class actions {
  /**
   * The database
   * @private
   */
  database;
  /**
   * The expration of tokens
   * One week in ms
   * @type {number}
   */
  tokenExpiration = 604800000;
  /**
   * The amount of bcrypt rounds to use.
   */
  rounds = 10;
  // Gives about 13 guesses/sec, with a password of abc1234password ( A very common password ) which is about what bcrypt gives
  // Safe to change whenever
  /**
   * The amount of sha256 rounds to use.
   * Can not increase yet.
   * @todo Add a function to allow this value to increase. ( How to: just set eatch value to the hash of the value for eatch additional round )
   */
  sha256Rounds = 20000;
  /**
   * Don't change this or the whole database will break
   * The amount of rounds to use when hashing the usernames
   * ( Uses sha256 )
   * @todo Add a function to allow this value to increase. ( How to: just set eatch value to the hash of the value for eatch additional round )
   */
  usernameRounds = 20000;
  // Do not change this or all tokens will stop working
  /**
   * The amount of rounds used in the token hash
   */
  tokenRounds = 300;
  /**
   * The default profile images
   * @type {string[]}
   * @private
   */
  defaultImages = ["default.jpeg", "defaultChicken.jpeg"];
  /**
   * Create a rsa key pair
   * @private
   * @returns {{"publicKey":string, "privateKey":string}}
   */
  _createRsaKeyPair() {
    return crypto.generateKeyPairSync("rsa", {
      // The standard length for a secure RSA key
      modulusLength: 2048,
      // How to encode the public key
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      // How to encode the private key ( Same encodeing )
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });
  }
  /**
   * The account scopes
   * Requires a value to be named _public_
   * @type {(...args) => {name:string,default:{[key in string|number]:any}}[]}
   * @private
   */
  _accountScopes = (_username, type, privateKey) => {
    return [
      {
        // Required for the database to properly operate
        // The only required attribute is password
        name: "public",
        // Things to tell people who know your username
        default: {
          banned: false,
          userType: type,
          imageName:
            this.defaultImages[
              crypto.randomInt(0, this.defaultImages.length - 1)
            ],
        },
      },
      {
        name: "important",
        // Things to POSSIBLY tell others          ||
        // Use _fromDateStorage to get date object \/
        default: { banReason: "", creationDate: this._now() },
      },
      {
        name: "private",
        // Things to keep private
        default: { classes: [] },
      },
      {
        // Required for the database to properly operate
        // All fields are required
        name: "internal",
        //  Don't allow users to move ANYTHING here.
        default: {
          // Keys for accessing other user's accounts
          /*
          looks like:
          {
            [Username hash of giver]:{
            attributes:{[attributeName]:[Index into data array]},
            // What values can be writen to
            writable:string[],
            expires:"never" | [Expiration date in hexatridecimal],
            // Not encripted because the entire attribute is encripted
            // TODO: add a function to update this when the pemissions required to get values change
            data: Array<string|undefined>, // An array of the LENGTH of all of the possible premissions of the token and all of the premissions it dose't have being set to undefined
          }
        }
          */
          userKeys: {},
          privateKey: privateKey,
        },
      },
    ];
  };
  /**
   * Create the database's basic structure
   * @param {string} [username] The username to create the admin account with. May not be "" or it will be ignored.
   * @param {string} [password] The password to create the admin account with. May not be "" or it will be ignored.
   * Note: not provideing username or password will prompt the user to enter one.
   * If the user provides a falsy value, it will genarate a random username and password.
   * Another note: the prompt will crash the repl.
   */
  static async init(username, password) {
    /*
    !!!Slight vulnerability: 
    if a attribute a program need ends up 
    in the same scope as some data they 
    should not have access to, 
    if the database leaks they will 
    have access to all of the attributes
    in that scope.

        Database structure:
        {
            users:{
                [Username sha 256 hash ( Uses a LOT of rounds )]:{
                    password:[Password bcrypt hash],
                    publicDataKey:[Cipher key for PUBLIC data encripted by USERNAME],
                    encryptionKeys:[[Cipher key for sensitive data object array encripted by password hash]],
                    attributes:{[attributeName]:[Index into sensitive data object array]},
                    // Has multiple objects for allowing multiple keys with different access scopes
                    sensitive:[...values](eatch value is json stringifyed then encripted by encryptionKeys[index]),
                    publicKey:[Public RSA key. Not to be confused with publicDataKey],
                    accessQuote:[[aes key and iv encripted by this user's public key, key encripted by the aes key and iv]]
                }
            },
            tokens:{
              // Each token is 48 bytes because it makes aes-256-cbc SO much easier because the required length of the iv and key amount together to 48 bytes
              [Token sha384 hash (Safe because the source is long enough to be resistant to rainbow table attacks, use only 300 rounds or something)]:{
                // TODO: add a function to update this when the locations in data array change
                attributes:{[attributeName]:[Index into data array]},
                // What values can be writen to
                writable:string[],
                createdAt:[Creation date in hexatridecimal],
                // Each non-null item is encripted by the token
                // TODO: add a function to update this when the pemissions required to get values change
                data: Array<string|undefined>, // An array of the LENGTH of all of the possible premissions of the token and all of the premissions it dose't have being set to undefined
                user: [Username hash]
              }
            }
        }
        */
    // Create database
    fs.writeFileSync("./new-db/database.db", "");
    var db = new QuickDB({ filePath: "./new-db/database.db" });
    await db.init();
    await db.set("users", {});
    var instance = new actions();
    /**
     * Create a random string
     * @param {number} length
     * @returns {string} A random string
     */
    const createRandom = (length) => {
      var chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_+-=[]\\;',./{}|:\"<>? ";
      var val = new Array(length)
        .fill(null)
        .map(() => chars[crypto.randomInt(chars.length)]);
      return val.join("");
    };
    //                                                         ||
    // Vscode has -∞ iq.                                       \/
    console.log(`${("[".red + "Database setup".blue + "]".red).bold}`);
    if (!(username || password)) {
      console.log(("[".red + "Setup admin account".blue + "]".red).bold);
      var readlineInterface = readline.createInterface(
        process.stdin,
        process.stdout
      );
      username =
        username ||
        (await readlineInterface.question(
          "Enter admin username".green + ":"
        )) ||
        createRandom(6);
      password =
        password ||
        (await readlineInterface.question(
          "Enter admin password".green + ":"
        )) ||
        createRandom(15);
      readlineInterface.close();
    }
    console.log(
      `Createing admin account with username ${username} and password ${password}`
    );
    await instance.createAccount(username, password?.toString(), "admin");
  }
  constructor() {
    this.database = new QuickDB({ filePath: "./new-db/database.db" });
  }
  /**
   * Create a hash from
   * @private
   * @param {string | Buffer} value
   */
  _hashOf(value) {
    return bcrypt.hashSync(value, this.rounds);
  }
  /**
   * Get the sha256 hash of a value
   * @param {crypto.BinaryLike} value
   * @param {crypto.Encoding | undefined} inputEncodeing
   * @param {crypto.BinaryToTextEncoding | undefined} outputEncodeing
   * @param {number} rounds The amount of rounds to use
   * @returns The hashed value
   */
  _shaHashOf(value, inputEncodeing, outputEncodeing, rounds) {
    rounds ||= this.sha256Rounds;
    for (let index = 0; index < rounds - 1; index++) {
      value = crypto
        .createHash("sha384")
        // Crypto is not well typed
        // @ts-ignore
        .update(value, inputEncodeing)
        .digest();
      // Delete inputEncodeing as it is no longer needed because the value is now a buffer
      inputEncodeing = undefined;
    }
    return crypto.createHash("sha384").update(value).digest(outputEncodeing);
  }
  /**
   * Encript data
   * @private
   * @param {string | Buffer} password
   * @param {any} value
   * @param {boolean} [doHash]
   * @param {number} [rounds]
   */
  _encript(password, value, doHash, rounds) {
    const hash = doHash
      ? this._shaHashOf(password, undefined, undefined, rounds)
      : password;
    /**
     * @type {(typeof String.prototype.slice) | (typeof Uint8Array.prototype.slice)}
     */
    var slice =
      hash instanceof Buffer
        ? Uint8Array.prototype.slice.bind(hash)
        : String.prototype.slice.bind(hash);
    const aesInst = new aes(slice(0, 32), slice(32, 48));
    return aesInst.encript(
      value instanceof Buffer ? value : JSON.stringify(value),
      "utf8",
      "base64url"
    );
  }
  /**
   * Decript data
   * @private
   * @param {string | Buffer} password
   * @param {any} value
   * @param {boolean} [doHash]
   * @param {number} [rounds]
   * @param {boolean} [returnBuffer] Return a buffer or not
   */
  _decript(password, value, doHash, rounds, returnBuffer) {
    const hash = doHash
      ? this._shaHashOf(password, undefined, undefined, rounds)
      : password;
    /**
     * @type {(typeof String.prototype.slice) | (typeof Uint8Array.prototype.slice)}
     */
    var slice =
      hash instanceof Buffer
        ? Uint8Array.prototype.slice.bind(hash)
        : String.prototype.slice.bind(hash);
    const aesInst = new aes(slice(0, 32), slice(32, 48));
    return returnBuffer
      ? aesInst.decrypt(value, "base64url")
      : JSON.parse(aesInst.decrypt(value, "base64url", "utf8"));
  }
  /**
   * Check if an array includes ALL of the values of another
   * @private
   * @param {any[]} arrayToCheck
   * @param {any[]} arrayOfRequiredValues
   * @returns {boolean} if the arrayToCheck array included all the values of arrayOfRequiredValues
   */
  _includesAll(arrayToCheck, arrayOfRequiredValues) {
    return (
      arrayOfRequiredValues.filter((v) => !arrayToCheck.includes(v)).length ===
      0
    );
  }
  /**
   * Create a 48-byte random string
   * @private
   * @returns { Buffer }
   */
  _createKey() {
    return crypto.randomBytes(48);
  }
  /**
   * Create an account
   * @overload
   * @param {string} username The username
   * @param {string} password The password
   * @param {string} userType The type of the user
   * @param {false} [dummy] Don't create a dummy account
   * @returns {Promise<void>}
   */
  /**
   * Create an dummy account.
   * Dummy accounts do not have passwords
   * and tokens can not be created,
   * with the exeption of the token returned
   * by this function if this option is provided.
   * @overload
   * @param {string} username The username
   * @param {undefined} password Not needed for dummy accounts
   * @param {string} userType The type of the user
   * @param {true} dummy Create a dummy account.
   * @returns {Promise<string>}
   */
  /**
   * Create an account
   * @param {string} username The username
   * @param {string | undefined} password The password ( Not required for dummy accounts )
   * @param {string} userType The type of the user
   * @param {boolean} [dummy] Whether to create a dummy account or not.
   * Dummy accounts do not have passwords
   * and tokens can not be created,
   * with the exeption of the token returned
   * by this function if this option is provided.
   * @returns {Promise<void|string>}
   */
  async createAccount(username, password, userType, dummy) {
    // Prevent "truthy" values from being counted as true
    dummy = dummy === true;
    var hash = this._shaHashOf(
      username,
      undefined,
      "base64url",
      this.usernameRounds
    );
    var { publicKey, privateKey } = this._createRsaKeyPair();
    var accountData = this._accountScopes(username, userType, privateKey);
    var encriptionKeys = accountData.map(() => this._createKey());
    // Hash username to prevent a list of usernames from being stolen
    await this.database.set(`users.${hash}`, {
      ...(dummy
        ? {}
        : // These attributes are not needed for dummy accounts
          {
            password: this._hashOf(password),
            encryptionKeys: encriptionKeys.map((k) =>
              this._encript(password, k, true, this.sha256Rounds)
            ),
          }),
      publicKey: publicKey,
      publicDataKey: this._encript(
        // Reverse to prevent identical hash as in database
        // Internaly hashes key
        username.split("").reverse().join(""),
        encriptionKeys[accountData.findIndex((v) => v.name === "public")],
        true,
        this.usernameRounds
      ),
      attributes: Object.fromEntries(
        accountData
          .map((v, i) => Object.keys(v.default).map((val) => [val, i]))
          .flat(1)
      ),
      sensitive: accountData.map((value, i) =>
        this._encript(encriptionKeys[i], value.default)
      ),
    });
    if (dummy) {
      return this.createToken(username, undefined, "*", true)[1];
    }
  }
  /**
   * Validate a username and password
   * @param {string} username The username
   * @param {string} password The password
   */
  async validateCredentials(username, password) {
    var hash = this._shaHashOf(
      username,
      undefined,
      "base64url",
      this.usernameRounds
    );
    // prettier-ignore
    return ((await this.database.has(`users.${hash}`)) && bcrypt.compareSync(await this.database.get(`users.${hash}.password`),password));
  }
  /**
   * Get the current date in hexatridecimal
   * @private
   * @returns {string} The current date as hexatridecimal
   */
  _now() {
    // Return date as base-36 (hexatridecimal)
    return Date.now().toString(36);
  }
  /**
   * Convert the return type of _now to a normal date
   * @private
   * @param {string} dateString The return value of _now
   * @returns {Date} The date that _now was called
   */
  _fromDateStorage(dateString) {
    return new Date(parseInt(dateString, 36));
  }
  // TODO: add a deleteAccount method
  /**
   * Get access keys from an account
   * @private
   * @param {string|undefined} username The username ( Not required if both attributes and encryptionKeys are provided )
   * @param {string|undefined} password The password ( Not required if encryptionKeys is provided )
   * @param {string[] | "*"} requiredValues The values that you want to be able to access
   * @param {{[key:string]:number}} [attributes] Overide attributes
   * @param {Array<Buffer>} [encryptionKeys] Overide encryptionKeys
   * @returns {Promise<[{[key:string]:number},(Buffer|undefined)[]]>} The keys for the required values
   */
  async _getAccountKeysByRequiredValues(
    username,
    password,
    requiredValues,
    attributes,
    encryptionKeys
  ) {
    var hash =
      attributes && encryptionKeys
        ? undefined
        : this._shaHashOf(
            username,
            undefined,
            "base64url",
            this.usernameRounds
          );
    attributes ||= await this.database.get(`users.${hash}.attributes`);
    var requiredAttributes =
      requiredValues === "*"
        ? attributes
        : Object.fromEntries(requiredValues.map((v) => [v, attributes[v]]));
    var requiredIndexes = Object.values(requiredAttributes);
    encryptionKeys ||= (
      await this.database.get(`users.${hash}.encryptionKeys`)
    ).map((v, i) =>
      requiredIndexes.includes(i)
        ? this._decript(password, v, true, this.sha256Rounds, true)
        : undefined
    );
    return [requiredAttributes, encryptionKeys];
  }
  /**
   * Get the basic structure of a auth token
   * @overload
   * @param {string} username The username of the user
   * @param {string} password The password of the user.
   * @param {premissionsStructure} premissions The premissions of the new tokenStructure
   * @returns {Promise<{
   * attributes: {
   *     [V:string]: number;
   * };
   * writable: string[];
   * data: Buffer[];
   * user: string;
   * }>}}
   */
  /**
   * Get the basic structure of a auth token FROM an exsisting token
   * @overload
   * @param {undefined} username Not needed because it is included in the token
   * @param {string} password The auth token
   * @param {premissionsStructure} premissions The premissions of the new tokenStructure
   * @param {true} fromToken Enable this setting
   * @returns {Promise<{
   * attributes: {
   *     [V:string]: number;
   * };
   * writable: string[];
   * data: Buffer[];
   * user: string;
   * }>}
   */
  /**
   * @private
   * @param {string|undefined} username
   * @param {string} password
   * @param {premissionsStructure} premissions
   * @param {boolean} [fromToken] If the password is a token.
   * @param {Omit<Awaited<ReturnType<typeof this._getBasicTokenStructure>>,"data"> & {data:string[]}} [tokenDbValue] The value of the token in the db.
   * @returns {Promise<{
   * attributes: {
   *     [V:string]: number;
   * };
   * writable: string[];
   * data: Buffer[];
   * user: string;
   * }>}
   */
  async _getBasicTokenStructure(
    username,
    password,
    premissions,
    fromToken,
    tokenDbValue
  ) {
    // @ts-ignore
    tokenDbValue ||= fromToken
      ? Object.fromEntries(
          Object.entries(await this._getTokenFromDatabase(password)).map(
            ([key, value]) => [
              key,
              key === "data"
                ? value.map((v) =>
                    typeof v === "undefined"
                      ? v
                      : this._decript(
                          Buffer.from(password, "base64url"),
                          v,
                          false,
                          0,
                          true
                        )
                  )
                : value,
            ]
          )
        )
      : undefined;
    /**
     * @type {string}
     */
    var usernameHash = fromToken
      ? tokenDbValue.user
      : this._shaHashOf(username, undefined, "base64url", this.usernameRounds);
    var premissionsAreAll = premissions === "*";
    var premissionsValues = premissionsAreAll
      ? undefined
      : Object.values(premissions);
    /**
     * @type {string[] | "*"}
     */
    var encriptionKeysRequiredFor =
      premissionsAreAll || premissionsValues.includes("*")
        ? "*"
        : premissionsValues.flat(1);
    var keys = fromToken
      ? await this._getAccountKeysByRequiredValues(
          undefined,
          undefined,
          encriptionKeysRequiredFor,
          tokenDbValue.attributes,
          tokenDbValue.data.map((v) => Buffer.from(v, "base64url"))
        )
      : await this._getAccountKeysByRequiredValues(
          username,
          password,
          encriptionKeysRequiredFor
        );
    return {
      attributes: keys[0],
      writable: premissionsAreAll
        ? Object.keys(keys[0])
        : // @ts-ignore
        premissions.readonly === "*"
        ? []
        : // @ts-ignore
          (premissions.writable === "*"
            ? Object.keys(keys[0])
            : // @ts-ignore
              premissions.writable
          )
            // @ts-ignore
            .filter((v) => !premissions.readonly.includes(v)),
      data: keys[1],
      user: usernameHash,
    };
  }
  /**
   * Create a auth token for a user
   * @overload
   * @param {string} username The username.
   * @param {string} password The password.
   * @param {premissionsStructure} premissions The required values to be able to access for this token. Readonly takes precedence.
   * @param {false} [fromToken] Use an exsisting token
   * @returns {Promise<[false,"Invalid credentials"]|[true,string]>} The error or token
   */
  /**
   * Create a auth token for a user from an exsisting token
   * @overload
   * @param {undefined} username The username. Not needed because it is included in the token.
   * @param {string} password The name of the token to clone.
   * @param {premissionsStructure} premissions The required values to be able to access for this token. Readonly takes precedence.
   * @param {true} fromToken Use an exsisting token
   * @returns {Promise<[true,string]>} The token
   */
  /**
   * Create a auth token for a user from a token-like value
   * @overload
   * @param {undefined} username The username. Not needed because it is included in the token.
   * @param {undefined} password Not needed.
   * @param {premissionsStructure} premissions The required values to be able to access for this token. Readonly takes precedence.
   * @param {true} fromToken Use an exsisting token
   * @param {any} tokenDBValue The value of the token to clone in the database.
   * @returns {Promise<[true,string]>} The token
   */
  /**
   * Create a auth token for a user
   * @param {string | undefined} username The username
   * @param {string | undefined} password The password. If fromToken is provided then it may also be a token or if fromToken AND tokenDBValue is provided this is not nessisary.
   * @param {premissionsStructure} premissions The required values to be able to access for this token. Readonly takes precedence.
   * @param {boolean} [fromToken] Use an exsisting token
   * @param {any} [tokenDBValue] The value of the token to clone in the database.
   * @returns {Promise<[false,"Invalid credentials"]|[true,string]>} The error or token
   */
  async createToken(username, password, premissions, fromToken, tokenDBValue) {
    if (
      // This is a bit confusing to be honest
      // So, one or zero?
      // TODO: remove jokes
      // Explanation: requires both values to be false to throw an error
      // So: if from token is true, don't check the credentials
      // and don't throw an error.
      // If from token is false and
      // if the credentials are invalid, throw an error
      // Same as (!x && !y) because
      // const and = (x,y) => !(!x || !y)
      // so (!x && !y) = !(!!x || !!y)
      // = !(x || y) <- and that is what I am useing
      !(fromToken || this.validateCredentials(username, password))
    ) {
      return [false, "Invalid credentials"];
    }
    var token = this._createKey();
    var tokenStructure = fromToken
      ? (tokenDBValue ? await this._getBasicTokenStructure(
        undefined,
        password,
        premissions,
        true
      ) : await this._getBasicTokenStructure(
          undefined,
          password,
          premissions,
          true
        ))
      : await this._getBasicTokenStructure(username, password, premissions);
    await this.database.set(
      `tokens.${this._shaHashOf(
        token,
        undefined,
        "base64url",
        this.tokenRounds
      )}`,
      {
        attributes: tokenStructure.attributes,
        writable: tokenStructure.writable,
        createdAt: this._now(),
        data: tokenStructure.data.map((v) =>
          typeof v === "undefined" ? v : this._encript(token, v, false)
        ),
        user: tokenStructure.user,
      }
    );
    return [true, token.toString("base64url")];
  }
  /**
   * Read a token from the database
   * @private
   * @param {string} token
   * @returns The value of the token
   */
  async _getTokenFromDatabase(token) {
    return await this.database.get(
      `tokens.${this._shaHashOf(
        token,
        "base64url",
        "base64url",
        this.tokenRounds
      )}`
    );
  }
  /**
   * Remove all expired tokens.
   * @returns {Promise<void>}
   */
  async purgeTokens() {
    const tokens = await this.database.get("tokens");
    // Remove all tokens older than preset expiration time
    const filtered = tokens.filter(
      (value) =>
        parseInt(value.createdAt, 36) + this.tokenExpiration < Date.now()
    );
    await this.database.set("tokens", filtered);
  }
  /**
   * Check the premissions of a token
   * @param {string} token The token
   * @param {boolean} [makeReadonlyIncludeAll] make readonly attribute include writable too.
   * @returns { Promise<{writable:string[],readonly:string[]}>} The available attributes
   */
  async _checkTokenPremissions(token, makeReadonlyIncludeAll) {
    var tokenDbValue = await this._getTokenFromDatabase(token);
    return typeof tokenDbValue === "undefined"
      ? { writable: [], readonly: [] }
      : {
          writable: tokenDbValue.writable,
          readonly: Object.keys(tokenDbValue.attributes).filter(
            (v) => makeReadonlyIncludeAll || !tokenDbValue.writable.includes(v)
          ),
        };
  }
  /**
   * Validate the premissions of token
   * @param {string} token The token to check
   * @param {{writable:string[],readonly:string[]}} requiredAttributes The required attributes for the token to be able to access
   * @returns {Promise<boolean>} If the token can access the attributes or not
   */
  async validateToken(token, requiredAttributes) {
    var premissions = await this._checkTokenPremissions(token, true);
    return (
      this._includesAll(premissions.writable, requiredAttributes.writable) &&
      this._includesAll(premissions.readonly, requiredAttributes.readonly)
    );
  }
  /**
   * Get data from a token
   * @private
   * @param {string} token The token
   */
  async _getTokenHandle(token) {
    var tokenBuffer = Buffer.from(token, "base64url");
    var tokenHash = this._shaHashOf(
      tokenBuffer,
      undefined,
      "base64url",
      this.tokenRounds
    );
    var tokenData = await this.database.get(`tokens.${tokenHash}`);
    // The encription keys
    var keys = tokenData.data.map((v) =>
      typeof v === "undefined"
        ? undefined
        : this._decript(tokenBuffer, v, false, 0, true)
    );
    var userLocation = `users.${tokenData.user}.sensitive`;
    var _encript = this._encript.bind(this);
    var database = this.database;
    return {
      userHash: tokenData.user,
      data: {
        /**
         * Read the value of an attribute
         * @overload
         * @param {string} key The key of the attribute
         * @returns {Promise<any>} The value
         */
        /**
         * Return stuff used for the write function
         * @overload
         * @private
         * @param {string} key The key of the attribute
         * @param {true} internal Return data required for the write function
         * @returns {Promise<[index:number,encriptionKey:string,value:any]>}
         */
        /**
         * Read the value of an attribute
         * @param {string} key The key of the attribute
         * @param {boolean} [internal] Return data required for the write function
         * @returns {Promise<any>} The value
         */
        read: async (key, internal) => {
          var splitKey = key.split(".");
          var index = tokenData.attributes[splitKey[0]];
          var encriptionKey = keys[index];
          if (!encriptionKey) {
            throw new Error(
              `Missing premissions to ${internal ? "read" : "write to"} ${key}`
            );
          }
          var encripted = await this.database.get(`${userLocation}.${index}`);
          var scope = this._decript(encriptionKey, encripted);
          return internal
            ? [index, encriptionKey, scope]
            : splitKey.reduce(
                (m, key) => (typeof m === "undefined" ? undefined : m[key]),
                scope
              );
        },
        /**
         * Set the value of an attribute
         * @param {string} key The key of the attribute
         * @param {any} newValue The new value of the attribute
         * @returns {Promise<void>}
         */
        write: async function (key, newValue) {
          var [index, encriptionKey, value] = await this.read(key, true);
          var splitKey = key.split(".");
          var v = value;
          while (splitKey.length > 1) {
            var k = splitKey.shift();
            if (!(k in v)) {
              v[k] = {};
            }
            v = v[k];
          }
          v[splitKey.shift()] = newValue;
          await database.set(
            `${userLocation}.${index}`,
            _encript(encriptionKey, value)
          );
        },
      },
    };
  }
  /**
   * Give account premissions to another user
   * @param {string} userToken A token of the user grant premissions _FROM_.
   * @param {string} toUserHash The hash of the username to grant premissions _TO_.
   * @param {{writable:string[],readonly:string[]} | "*"} premissions The premissions to give the user.
   * @param {"never"|Date} [expires] When the auth expires. Not provideing a date will cause it to never expire.
   * @returns {Promise<void>}
   */
  async giveAuth(userToken, toUserHash, premissions, expires) {
    var toUserPublicKey = await this.database.get(
      `users.${toUserHash}.publicKey`
    );
    var tokenStructure = await this._getBasicTokenStructure(
      undefined,
      userToken,
      premissions,
      true
    );
    // Tell vscode to not yell when I change the type of the data attribute
    // @ts-ignore
    tokenStructure.data = tokenStructure.data.map((v) =>
      v.toString("base64url")
    );
    var tokenValue = {
      ...tokenStructure,
      expires:
        expires instanceof Date ? expires.getTime().toString(36) : "never",
    };
    var tokenBuffer = Buffer.from(JSON.stringify(tokenValue));
    var aesKey = aes.genKeys();
    var key = crypto.publicEncrypt(
      {
        key: toUserPublicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.concat(aesKey)
    );
    var aesInst = new aes(...aesKey);
    var encripted = aesInst.encript(tokenBuffer, "utf8", "base64url");
    await this.database.push(`users.${toUserHash}.accessQuote`, [
      key.toString("base64url"),
      encripted,
    ]);
  }
  /**
   * Finish processing all pending premissions given from other users
   * @param {string} token The auth token of the user. Must have read access to the user's privateKey and write access to userKeys.
   * @returns {Promise<
   * {
   *   attributes:{[key:string]:number},
   *   writable:string[],
   *   expires:"never" | string,
   *   data: Array<string|undefined>,
   *   user: string
   * }[]>}
   */
  async getAuths(token) {
    var handle = await this._getTokenHandle(token);
    var quote = await this.database.get(`users.${handle.userHash}.accessQuote`);
    if (quote.length === 0) {
      return [];
    }
    await this.database.set(`users.${handle.userHash}.accessQuote`, []);
    try {
      // Get the user's private key to decript the quote.
      var privateKey = await handle.data.read("privateKey");
      var decryptedQuote = quote.map(
        ([encriptedAesKey, encriptedAccessKey]) => {
          // Decript the aes key with the rsa private key
          var aesKey = crypto.privateDecrypt(
            {
              key: privateKey,
              padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
              oaepHash: "sha256",
            },
            // Convert the encripted aes key to a buffer
            Buffer.from(encriptedAesKey, "base64url")
          );
          // Create a aes class instance to decript the access key
          var aesInst = new aes(
            aesKey.subarray(0, 32),
            aesKey.subarray(32, 48)
          );
          // Decript the access key and put it into the array.
          return aesInst.decrypt(encriptedAccessKey, "base64url", "utf8");
        }
      );
    } catch (e) {
      // Abort operation if anything goes wrong
      // Note: the for loop and push is just in
      // case another value has been added to
      // the quote so it dose not get deleted.
      for (const val in quote) {
        await this.database.push(`users.${handle.userHash}.accessQuote`, val);
      }
      throw e;
    } finally {
      for (var value of decryptedQuote) {
        var user = value.user;
        delete value.user;
        await handle.data.write(`userKeys.${user}`, value);
      }
      return decryptedQuote;
    }
  }
  /**
   * Change a user's premission level
   * @param {string} token The auth token for the user createing the request
   * @param {string} username The username for the user to change the premissions for
   * @param {string} type The premission level
   */
  async setUserType(token, username, type) {
    var hash = this._hashOf(username);
  }
};

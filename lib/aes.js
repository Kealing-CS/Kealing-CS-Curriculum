// For aes
const crypto = require("crypto");
// The algorithm to use.
const algorithmToUse = "aes-256-cbc";
module.exports = class aes {
  algorithm;
  /**
   * Create an AES key and iv pair
   * @param {boolean} [aes256=true]
   * @returns { [Buffer,Buffer] }
   */
  static genKeys(aes256) {
    return aes256 === false
      ? [
          // key
          crypto.randomBytes(16),
          //iv
          crypto.randomBytes(16),
        ]
      : [
          // key
          crypto.randomBytes(32),
          //iv
          crypto.randomBytes(16),
        ];
  }
  /**
   * Create an AES cipher
   * @param { crypto.CipherKey } key
   * @param { crypto.BinaryLike } iv
   * @param { string } [algorithm] The aes algorithm to use
   */
  constructor(key, iv, algorithm) {
    this.key = key;
    this.iv = iv;
    this.algorithm = algorithm || algorithmToUse;
  }
  /**
   * Return a string
   * @overload
   * @param { string | ArrayBufferView } data The string to encript
   * @param { BufferEncoding | undefined } inputEncodeing The encodeing of the input string.
   * @param { BufferEncoding } encodeing The output string encoding.
   * @returns { string } The encripted data
   */
  /**
   * Return a buffer
   * @overload
   * @param { string | ArrayBufferView } data The string to encript
   * @param { BufferEncoding | undefined} [inputEncodeing] The encodeing of the input string.
   * @param { undefined } [encodeing] The output string encoding. Required to be undefined to return a buffer.
   * @returns { Buffer } The encripted data
   */
  /**
   * Encript some data
   * @param {string | ArrayBufferView} data
   * @param {BufferEncoding | undefined} inputEncodeing
   * @param {BufferEncoding | undefined} encodeing
   * @returns {string | Buffer}
   */
  encript(data, inputEncodeing, encodeing) {
    var cipher = crypto.createCipheriv(algorithmToUse, this.key, this.iv);
    var values = [
      // @ts-ignore
      cipher.update(data, inputEncodeing, encodeing),
      cipher.final(encodeing),
    ];
    // @ts-ignore
    return encodeing ? values.join("") : Buffer.concat(values);
  }
  /**
   * Return a string
   * @overload
   * @param { string | ArrayBufferView} encryptedData The string to encript
   * @param { BufferEncoding | undefined } inputEncodeing The encodeing of the input string.
   * @param { BufferEncoding } encodeing The output string encoding.
   * @returns { string } The encripted data
   */
  /**
   * Return a buffer
   * @overload
   * @param { string | ArrayBufferView } encryptedData The string to encript
   * @param { BufferEncoding | undefined} [inputEncodeing] The encodeing of the input string.
   * @param { undefined } [encodeing] The output string encoding. Required to be undefined to return a buffer.
   * @returns { Buffer } The encripted data
   */
  /**
   * Decript some data
   * @param { string | ArrayBufferView } encryptedData The string to encript
   * @param { BufferEncoding | undefined} [inputEncodeing] The encodeing of the input string.
   * @param { BufferEncoding | undefined} [encodeing] The output string encoding. Required to be undefined to return a buffer.
   * @returns { Buffer | string} The encripted data
   */
  decrypt(encryptedData, inputEncodeing, encodeing) {
    var cipher = crypto.createDecipheriv(algorithmToUse, this.key, this.iv);
    var values = [
      // @ts-ignore
      cipher.update(encryptedData, inputEncodeing, encodeing),
      cipher.final(encodeing),
    ];
    // @ts-ignore
    return encodeing ? values.join("") : Buffer.concat(values);
  }
};

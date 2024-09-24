const crypto = require("crypto");
const { KeyLength, HMACAlgorithm } = require("./constants");

class HMACGenerator {
  static generateKey() {
    return crypto.randomBytes(KeyLength);
  }

  static generateHMAC(key, message) {
    return crypto.createHmac(HMACAlgorithm, key).update(message).digest("hex");
  }
}

module.exports = HMACGenerator;

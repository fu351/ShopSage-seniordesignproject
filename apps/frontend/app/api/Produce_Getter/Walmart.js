const crypto = require('crypto');

/**
 * Canonicalizes the headers required for signing.
 * Produces a string like: "<WM_CONSUMER.ID>\n<WM_CONSUMER.INTIMESTAMP>\n<WM_SEC.KEY_VERSION>\n"
 *
 * @param {Object} headers - The headers object.
 * @returns {string} The canonicalized string.
 */
function canonicalize(headers) {
  const keys = Object.keys(headers).map(key => key.trim()).sort();
  return keys.map(key => headers[key].toString().trim()).join('\n') + '\n';
}

/**
 * Generates an RSA-SHA256 signature of the provided string using the given private key.
 *
 * @param {string} privateKeyPem - Your RSA private key in PEM format.
 * @param {string} stringToSign - The canonicalized string to sign.
 * @returns {string} - The Base64-encoded signature.
 */
function generateSignature(privateKeyPem, stringToSign) {
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(stringToSign, 'utf8');
  return signer.sign(privateKeyPem, 'base64');
}

/**
 * Generates the additional headers required by Walmart’s API.
 *
 * @param {string} consumerId - Your Walmart Consumer ID.
 * @param {string} keyVersion - Your key version.
 * @param {string} privateKeyPem - Your private key in PEM format.
 * @returns {Object} An object with the required headers.
 */
function generateAdditionalHeaders(consumerId, keyVersion, privateKeyPem) {
  // Use current timestamp in milliseconds (or seconds if required; check the docs)
  const intimestamp = Date.now().toString();
  // Generate a correlation ID – using Node.js v14+ crypto.randomUUID if available:
  const correlationId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');

  const headersToSign = {
    "WM_CONSUMER.ID": consumerId,
    "WM_CONSUMER.INTIMESTAMP": intimestamp,
    "WM_SEC.KEY_VERSION": keyVersion
  };

  const canonicalized = canonicalize(headersToSign);
  const authSignature = generateSignature(privateKeyPem, canonicalized);

  return {
    "WM_SVC.NAME": "Walmart Marketplace", // As specified by the docs
    "WM_QOS.CORRELATION_ID": correlationId,
    "WM_SEC.TIMESTAMP": intimestamp,
    "WM_SEC.AUTH_SIGNATURE": authSignature,
    "WM_CONSUMER.ID": consumerId,
    "WM_SEC.KEY_VERSION": keyVersion
  };
}
try {
    const consumerId = "4a2be957-3f76-452c-a786-7e8de193e396";
    const keyVersion = "1";
    const privateKeyPem = 'Priv Key Here';
    const signature = generateAdditionalHeaders(consumerId, keyVersion, privateKeyPem)
    console.log("Signature:", signature);
  } catch (err) {
    console.error("Error generating signature:", err);
  }
const awsSdk = require('aws-sdk');


/**
 * AWSClient - Description
 * @class AWSClient
 * @prop {object} AWS the aws sdk
 */
function AWSClient() {
  this.AWS = awsSdk;
}

/**
 * A Callback for processing the image once upload succeeds or fails
 *
 * @callback uploadImageCallback
 * @param {object} err an error object
 * @param {string} a url string
 * @returns {undefined}
 */

/**
 * uploadImage - Description
 * @memberof AWSClient
 * @instance
 * @param {string} bucket   the bucket name
 * @param {string} imgData  the img data
 * @param {string} mimeType the mimetype
 * @param {string} filename the filename
 * @param {uploadImageCallback} cb       the callback function
 *
 * @returns {undefined}
 */
AWSClient.prototype.uploadImage = function uploadImage(bucket, imgData, mimeType, filename, cb) {
  const s3 = new this.AWS.S3();
  s3.createBucket({ Bucket: bucket }, (err) => {
    if (err) {
      cb(err, null);
    } else {
      s3.putObject({
        Bucket: bucket,
        Key: filename,
        ContentType: mimeType,
        Body: imgData,
        ACL: 'public-read',
        CacheControl: 'public, max-age=31536000',
      }, (err) => {
        cb(err, `https://s3.amazonaws.com/${bucket}/${filename}`);
      });
    }
  });
};

/**
 * uploadImage - Description
 * @memberof AWSClient
 * @instance
 * @param {string} bucket   the bucket name
 * @param {string} imgData  the img data
 * @param {string} mimeType the mimetype
 * @param {string} filename the filename
 *
 * @returns {Promise<string>} resolves url of asset
 */
AWSClient.prototype.uploadImageAsync = function uploadImageAsync(...args) {
  return new Promise((resolve, reject) => {
    this.uploadImage(...args, (err, result) => (err ? reject(err) : resolve(result)));
  });
};

module.exports = AWSClient;

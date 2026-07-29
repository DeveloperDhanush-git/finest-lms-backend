const fs = require('fs');
const path = require('path');

const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');

const privateKey = fs.readFileSync(
  path.join(process.cwd(), process.env.CLOUDFRONT_PRIVATE_KEY_PATH),
  'utf8'
);

const generateSignedUrl = (url) => {
  return getSignedUrl({
    url,

    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,

    privateKey,

    dateLessThan: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });
};

module.exports = {
  generateSignedUrl,
};

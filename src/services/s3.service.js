const s3 = require('../config/s3');

const {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} = require('@aws-sdk/client-s3');

const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

/**
 * Resolve Content-Type and Cache-Control based on file extension.
 *
 * Strategy (Netflix / Udemy / Coursera standard):
 *  - .m3u8 playlists  → no-cache  (always revalidate so new versions are picked up)
 *  - .ts segments     → immutable, 1-year max-age (content-addressed via versioned prefix)
 *  - images           → immutable, 1-year max-age (versioned key ensures freshness)
 *  - videos (mp4 etc) → immutable, 1-year max-age (versioned key ensures freshness)
 *  - everything else  → 1-year max-age
 */
const resolveHeaders = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  let contentType;
  let cacheControl;

  switch (extension) {
    case '.m3u8':
      contentType = 'application/vnd.apple.mpegurl';
      cacheControl = 'no-cache, no-store, must-revalidate';
      break;

    case '.ts':
      contentType = 'video/mp2t';
      cacheControl = 'public, max-age=31536000, immutable';
      break;

    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.webp':
    case '.gif':
    case '.svg':
      contentType = mime.lookup(filePath) || 'application/octet-stream';
      cacheControl = 'public, max-age=31536000, immutable';
      break;

    case '.mp4':
    case '.webm':
    case '.mov':
      contentType = mime.lookup(filePath) || 'application/octet-stream';
      cacheControl = 'public, max-age=31536000, immutable';
      break;

    default:
      contentType = mime.lookup(filePath) || 'application/octet-stream';
      cacheControl = 'public, max-age=31536000, immutable';
  }

  return { contentType, cacheControl };
};

const uploadFileToS3 = async (localPath, key) => {
  const fileStream = fs.createReadStream(localPath);

  const { contentType, cacheControl } = resolveHeaders(localPath);

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,

      Key: key,

      Body: fileStream,

      ContentType: contentType,

      CacheControl: cacheControl,
    })
  );

  return `${process.env.CLOUDFRONT_URL}/${key}`;
};

const deleteFileFromS3 = async (key) => {
  if (!key) return;

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET,

      Key: key,
    })
  );
};

const deleteDirectoryFromS3 = async (prefix) => {
  if (!prefix) return;

  let continuationToken;

  do {
    const listed = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET,

        Prefix: prefix,

        ContinuationToken: continuationToken,
      })
    );

    if (listed.Contents && listed.Contents.length > 0) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: process.env.AWS_BUCKET,

          Delete: {
            Objects: listed.Contents.map(({ Key }) => ({
              Key,
            })),
          },
        })
      );
    }

    continuationToken = listed.IsTruncated ? listed.NextContinuationToken : undefined;
  } while (continuationToken);
};

const uploadCertificateToS3 = async (filePath, key) => {
  const fileContent = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,

    Key: key,

    Body: fileContent,

    ContentType: 'application/pdf',
  });

  await s3.send(command);

  fs.unlinkSync(filePath);

  return {
    key,

    url: `${process.env.CLOUDFRONT_URL}/${key}`,
  };
};

module.exports = {
  uploadFileToS3,

  deleteFileFromS3,

  deleteDirectoryFromS3,

  uploadCertificateToS3,
};

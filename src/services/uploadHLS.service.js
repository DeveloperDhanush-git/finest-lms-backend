const path = require('path');
const fs = require('fs-extra');
const { randomUUID } = require('crypto');

const { uploadFileToS3 } = require('./s3.service');

const uploadHLSDirectoryToS3 = async (lectureId, outputFolder) => {
  const version = randomUUID();

  const basePrefix = `lectures/${lectureId}/${version}`;

  const uploaded = [];

  async function uploadFolder(folder) {
    const files = await fs.readdir(folder);

    for (const file of files) {
      const fullPath = path.join(folder, file);

      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        await uploadFolder(fullPath);

        continue;
      }

      const relative = path.relative(outputFolder, fullPath);

      const key = path.join(basePrefix, relative).replace(/\\/g, '/');

      console.log('Uploading:', key);

      const url = await uploadFileToS3(fullPath, key);

      uploaded.push({
        relative,
        key,
        url,
      });
    }
  }

  await uploadFolder(outputFolder);

  console.log(`Uploaded ${uploaded.length} files to S3`);

  return {
    uploaded,
    basePrefix,
  };
};

module.exports = {
  uploadHLSDirectoryToS3,
};

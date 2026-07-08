const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(process.cwd(), 'storage', 'uploads');

fs.mkdirSync(uploadDir, {
  recursive: true,
});

const diskStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);

    cb(null, unique + path.extname(file.originalname));
  },
});

const uploadVideo = multer({
  storage: diskStorage,

  limits: {
    fileSize: 5 * 1024 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('video/')) {
      return cb(null, true);
    }

    cb(new Error('Only video files are allowed.'));
  },
});

const uploadResource = multer({
  storage: diskStorage,

  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

const uploadImage = multer({
  storage: diskStorage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }

    cb(new Error('Only image files are allowed.'));
  },
});

module.exports = {
  uploadVideo,

  uploadResource,

  uploadImage,
};

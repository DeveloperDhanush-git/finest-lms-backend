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
    // FIX: Use cb(null, false) to reject cleanly without aborting the socket.
    // Attach a flag so the controller can detect the rejection and send a proper error.
    req.fileRejectionReason = 'Only video files are allowed.';
    cb(null, false);
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
    // FIX: Same safe rejection pattern.
    req.fileRejectionReason = 'Only image files are allowed.';
    cb(null, false);
  },
});

/**
 * Express error-handling middleware for Multer errors.
 * Mount this AFTER the Multer middleware on any route that uses file uploads.
 * It must have 4 params so Express treats it as an error handler.
 *
 * Multer throws MulterError for limit violations (file size, field count, etc.).
 * This middleware intercepts those and converts them to clean 400 responses
 * without leaving the request in a broken/hanging state.
 */
const multerErrorHandler = (err, req, res, next) => {
  if (err && err.name === 'MulterError') {
    // Multer-specific errors (e.g. file size exceeded)
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error.',
      errorCode: 'FILE_UPLOAD_ERROR',
    });
  }
  // Not a Multer error — pass to the next error handler
  next(err);
};

module.exports = {
  uploadVideo,
  uploadResource,
  uploadImage,
  multerErrorHandler,
};

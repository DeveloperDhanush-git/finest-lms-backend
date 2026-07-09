const certificateService = require('../services/certificate.service');
const { asyncHandler, success, created } = require('../helpers');

const generateCertificate = asyncHandler(async (req, res) => {
  const certificate = await certificateService.generateCertificate(
    req.user._id,
    req.params.courseId
  );
  return created(res, 'Certificate generated successfully.', certificate);
});

const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await certificateService.getMyCertificates(req.user._id);
  return success(res, 'Certificates retrieved successfully', certificates);
});

const getCertificateByCourse = asyncHandler(async (req, res) => {
  const certificate = await certificateService.getCertificateByCourse(
    req.user._id,
    req.params.courseId
  );
  return success(res, 'Certificate retrieved successfully', certificate);
});

const downloadCertificate = asyncHandler(async (req, res) => {
  const result = await certificateService.downloadCertificate(req.user._id, req.params.courseId);
  return success(res, 'Certificate downloaded successfully', result);
});

const verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await certificateService.verifyCertificate(req.params.verificationCode);
  return success(res, 'Certificate verified successfully', certificate);
});

module.exports = {
  generateCertificate,
  getMyCertificates,
  getCertificateByCourse,
  downloadCertificate,
  verifyCertificate,
};

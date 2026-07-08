const certificateService = require('../services/certificate.service');

const generateCertificate = async (req, res, next) => {
  try {
    const certificate = await certificateService.generateCertificate(
      req.user._id,
      req.params.courseId
    );

    return res.status(201).json({
      success: true,
      message: 'Certificate generated successfully.',
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await certificateService.getMyCertificates(req.user._id);

    return res.status(200).json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
};

const getCertificateByCourse = async (req, res, next) => {
  try {
    const certificate = await certificateService.getCertificateByCourse(
      req.user._id,
      req.params.courseId
    );

    return res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

const downloadCertificate = async (req, res, next) => {
  try {
    const result = await certificateService.downloadCertificate(req.user._id, req.params.courseId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await certificateService.verifyCertificate(req.params.verificationCode);

    return res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateCertificate,
  getMyCertificates,
  getCertificateByCourse,
  downloadCertificate,
  verifyCertificate,
};

const crypto = require('crypto');
const path = require('path');
const { v4: uuid } = require('uuid');

const User = require('../models/user.model');
const InstructorProfile = require('../models/instructor.model');

const generateCertificatePdf = require('../utils/generateCertificatePdf');

const { uploadCertificateToS3 } = require('./s3.service');

const Certificate = require('../models/certificate.model');
const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');

const generateCertificateNumber = async () => {
  const year = new Date().getFullYear();

  const total = await Certificate.countDocuments();

  return `FINEST-${year}-${String(total + 1).padStart(6, '0')}`;
};

const generateVerificationCode = () => {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
};

const generateCertificate = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({
    studentId: userId,
    courseId,
  });

  if (!enrollment) {
    throw new Error('You are not enrolled in this course.');
  }

  if (enrollment.status !== 'completed') {
    throw new Error('Complete the course before generating certificate.');
  }

  const exists = await Certificate.findOne({
    studentId: userId,
    courseId,
  });

  if (exists) {
    return exists;
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error('Course not found.');
  }
  const student = await User.findById(userId);

  const instructor = await InstructorProfile.findById(course.instructorId).populate(
    'userId',
    'firstName lastName'
  );

  const certificateNumber = await generateCertificateNumber();

  const verificationCode = generateVerificationCode();

  const filename = `${uuid()}.pdf`;

  const outputPath = path.join(process.cwd(), 'temp', 'certificates', filename);

  await generateCertificatePdf(
    {
      studentName: student.lastName ? `${student.firstName} ${student.lastName}` : student.firstName,

      courseTitle: course.title,

      instructor: instructor.userId.lastName ? `${instructor.userId.firstName} ${instructor.userId.lastName}` : instructor.userId.firstName,

      date: new Date().toLocaleDateString(),

      certificateNumber,

      verificationCode,
    },
    outputPath
  );

  const key = `certificates/${userId}/${filename}`;

  const upload = await uploadCertificateToS3(outputPath, key);

  const certificate = await Certificate.create({
    studentId: userId,

    courseId,

    enrollmentId: enrollment._id,

    certificateNumber,

    verificationCode,

    certificateUrl: upload.url,

    certificateKey: upload.key,
  });

  enrollment.certificateIssued = true;

  enrollment.certificateIssuedAt = new Date();

  await enrollment.save();

  // Send Notification
  try {
    const { createNotification } = require('./notification.service');
    const senderUserId = instructor && instructor.userId ? instructor.userId._id : null;
    await createNotification({
      recipientId: userId,
      senderId: senderUserId,
      type: 'CERTIFICATE_GENERATED',
      title: 'Certificate Generated!',
      message: `Congratulations! Your certificate for "${course.title}" was successfully generated.`,
      data: { courseId, certificateId: certificate._id },
    });
  } catch (err) {
    console.error('Failed to send CERTIFICATE_GENERATED notification:', err.message);
  }

  return certificate;
};

const getMyCertificates = async (userId) => {
  return await Certificate.find({
    studentId: userId,
    isRevoked: false,
  })
    .populate({
      path: 'courseId',
      select: 'title thumbnail averageRating',
    })
    .sort({
      issuedAt: -1,
    });
};

const getCertificateByCourse = async (userId, courseId) => {
  const certificate = await Certificate.findOne({
    studentId: userId,
    courseId,
    isRevoked: false,
  })
    .populate({
      path: 'courseId',
      select: 'title thumbnail',
    })
    .populate({
      path: 'studentId',
      select: 'firstName lastName email',
    });

  if (!certificate) {
    throw new Error('Certificate not found.');
  }

  return certificate;
};

const downloadCertificate = async (userId, courseId) => {
  const certificate = await Certificate.findOne({
    studentId: userId,
    courseId,
    isRevoked: false,
  });

  if (!certificate) {
    throw new Error('Certificate not found.');
  }

  return {
    url: certificate.certificateUrl,
  };
};

const verifyCertificate = async (verificationCode) => {
  const certificate = await Certificate.findOne({
    verificationCode,
  })
    .populate({
      path: 'studentId',
      select: 'firstName lastName',
    })
    .populate({
      path: 'courseId',
      populate: {
        path: 'instructorId',
        populate: {
          path: 'userId',
          select: 'firstName lastName',
        },
      },
    });

  if (!certificate) {
    throw new Error('Invalid certificate.');
  }

  return certificate;
};

module.exports = {
  generateCertificate,
  getMyCertificates,
  getCertificateByCourse,
  downloadCertificate,
  verifyCertificate,
};

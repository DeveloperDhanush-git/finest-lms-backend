const crypto = require("crypto");
const path = require("path");
const { v4: uuid } = require("uuid");

const User = require("../models/user.model");
const InstructorProfile = require("../models/instructor.model");

const generateCertificatePdf = require("../utils/generateCertificatePdf");

const {
  uploadCertificateToS3,
} = require("./s3.service");

const Certificate = require("../models/certificate.model");
const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");

/*
------------------------------------------
Generate Certificate Number
------------------------------------------
*/

const generateCertificateNumber =
  async () => {

    const year =
      new Date().getFullYear();

    const total =
      await Certificate.countDocuments();

    return `FINEST-${year}-${String(total + 1).padStart(6, "0")}`;

  };

/*
------------------------------------------
Generate Verification Code
------------------------------------------
*/

const generateVerificationCode =
  () => {

    return crypto
      .randomBytes(6)
      .toString("hex")
      .toUpperCase();

  };

/*
------------------------------------------
Generate Certificate
------------------------------------------
*/

const generateCertificate = async (
  userId,
  courseId
) => {

  const enrollment =
    await Enrollment.findOne({
      studentId: userId,
      courseId,
    });

  if (!enrollment) {
    throw new Error(
      "You are not enrolled in this course."
    );
  }

  if (
    enrollment.status !==
    "completed"
  ) {
    throw new Error(
      "Complete the course before generating certificate."
    );
  }

  const exists =
    await Certificate.findOne({
      studentId: userId,
      courseId,
    });

  if (exists) {
    return exists;
  }

  /*
  ----------------------------------------
  Fetch Course
  ----------------------------------------
  */

  const course =
    await Course.findById(courseId);

  if (!course) {
    throw new Error(
      "Course not found."
    );
  }

  /*
  ----------------------------------------
  Fetch Student
  ----------------------------------------
  */

  const student =
    await User.findById(userId);

  /*
  ----------------------------------------
  Fetch Instructor
  ----------------------------------------
  */

  const instructor =
    await InstructorProfile
      .findById(course.instructorId)
      .populate(
        "userId",
        "firstName lastName"
      );

  /*
  ----------------------------------------
  Generate Numbers
  ----------------------------------------
  */

  const certificateNumber =
    await generateCertificateNumber();

  const verificationCode =
    generateVerificationCode();

  /*
  ----------------------------------------
  Generate PDF
  ----------------------------------------
  */

  const filename =
    `${uuid()}.pdf`;

  const outputPath =
    path.join(
      process.cwd(),
      "temp",
      "certificates",
      filename
    );

    await generateCertificatePdf(
    {
      studentName:
        `${student.firstName} ${student.lastName}`,

      courseTitle:
        course.title,

      instructor:
        `${instructor.userId.firstName} ${instructor.userId.lastName}`,

      date:
        new Date().toLocaleDateString(),

      certificateNumber,

      verificationCode,
    },
    outputPath
  );

  /*
  ----------------------------------------
  Upload To S3
  ----------------------------------------
  */

  const key =
    `certificates/${userId}/${filename}`;

  const upload =
    await uploadCertificateToS3(
      outputPath,
      key
    );

  /*
  ----------------------------------------
  Save Certificate
  ----------------------------------------
  */

  const certificate =
    await Certificate.create({

      studentId: userId,

      courseId,

      enrollmentId:
        enrollment._id,

      certificateNumber,

      verificationCode,

      certificateUrl:
        upload.url,

      certificateKey:
        upload.key,

    });

  /*
  ----------------------------------------
  Update Enrollment
  ----------------------------------------
  */

  enrollment.certificateIssued =
    true;

  enrollment.certificateIssuedAt =
    new Date();

  await enrollment.save();

  return certificate;

};

/*
------------------------------------------
My Certificates
------------------------------------------
*/

const getMyCertificates =
  async (userId) => {

    return await Certificate.find({
      studentId: userId,
      isRevoked: false,
    })
      .populate({
        path: "courseId",
        select:
          "title thumbnail averageRating",
      })
      .sort({
        issuedAt: -1,
      });

  };

/*
------------------------------------------
Course Certificate
------------------------------------------
*/

const getCertificateByCourse =
  async (
    userId,
    courseId
  ) => {

    const certificate =
      await Certificate.findOne({
        studentId: userId,
        courseId,
        isRevoked: false,
      })
        .populate({
          path: "courseId",
          select:
            "title thumbnail",
        })
        .populate({
          path: "studentId",
          select:
            "firstName lastName email",
        });

    if (!certificate) {
      throw new Error(
        "Certificate not found."
      );
    }

    return certificate;

  };

/*
------------------------------------------
Download Certificate
------------------------------------------
*/

const downloadCertificate =
  async (
    userId,
    courseId
  ) => {

    const certificate =
      await Certificate.findOne({
        studentId: userId,
        courseId,
        isRevoked: false,
      });

    if (!certificate) {
      throw new Error(
        "Certificate not found."
      );
    }

    return {
      url:
        certificate.certificateUrl,
    };

  };

/*
------------------------------------------
Verify Certificate
------------------------------------------
*/

const verifyCertificate =
  async (
    verificationCode
  ) => {

    const certificate =
      await Certificate.findOne({
        verificationCode,
      })
        .populate({
          path: "studentId",
          select:
            "firstName lastName",
        })
        .populate({
          path: "courseId",
          populate: {
            path: "instructorId",
            populate: {
              path: "userId",
              select:
                "firstName lastName",
            },
          },
        });

    if (!certificate) {
      throw new Error(
        "Invalid certificate."
      );
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
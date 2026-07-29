const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateCertificatePdf = (data, outputPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margin: 40,
    });
    const folder = path.dirname(outputPath);

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {
        recursive: true,
      });
    }
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    doc.rect(20, 20, 800, 555).lineWidth(3).stroke();

    doc.fontSize(32).font('Helvetica-Bold').text('CERTIFICATE OF COMPLETION', {
      align: 'center',
    });

    doc.moveDown();

    doc.fontSize(18).font('Helvetica').text('This certificate is proudly presented to', {
      align: 'center',
    });

    doc.moveDown();

    doc.fontSize(28).font('Helvetica-Bold').text(data.studentName, {
      align: 'center',
    });

    doc.moveDown();

    doc.fontSize(18).font('Helvetica').text('for successfully completing', {
      align: 'center',
    });

    doc.moveDown();

    doc.fontSize(24).font('Helvetica-Bold').fillColor('#1D4ED8').text(data.courseTitle, {
      align: 'center',
    });

    doc.fillColor('black');

    doc.moveDown(2);

    doc.fontSize(16);

    doc.text(`Instructor : ${data.instructor}`, 80, 360);

    doc.text(`Issued On : ${data.date}`, 80, 390);

    doc.text(`Certificate No : ${data.certificateNumber}`, 80, 420);

    doc.text(`Verification Code : ${data.verificationCode}`, 80, 450);

    doc.fontSize(22);

    doc.text('Fine Course Mart ', 600, 500);

    doc.end();

    stream.on('finish', () => resolve(outputPath));

    stream.on('error', reject);
  });
};

module.exports = generateCertificatePdf;

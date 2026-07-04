require('dotenv').config();

const app = require('./app');

const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Server is running in http://[IP_ADDRESS]:${PORT}`);
            console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
        });
        const generateCertificatePdf =
require("./utils/generateCertificatePdf");

generateCertificatePdf(
{
    studentName:
        "John Nellore",

    courseTitle:
        "Complete MERN Stack Bootcamp",

    instructor:
        "Principal Software Engineer",

    date:
        "03 July 2026",

    certificateNumber:
        "FINEST-2026-000001",

    verificationCode:
        "9F73A1B6"
},
"./temp/certificates/sample.pdf"
).then(() => {
    console.log("Certificate Generated");
});
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();

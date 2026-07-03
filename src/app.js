const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const app = express();

const swaggerDocs = require('./config/swagger');
swaggerDocs(app);

// Global Security Middlewares
app.use(helmet()); // Set security HTTP headers
app.use(
    "/api/payments/webhook",
    express.raw({
        type: "application/json"
    })
);

app.use(
    express.json({
        limit: "10kb"
    })
);
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(compression()); // Compress response bodies

// Rate Limiting
const limiter = rateLimit({
    max: 200, // Limit each IP to 100 requests per windowMs
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', limiter);

// Specific Rate Limiter for Auth (Stricter)
const authLimiter = rateLimit({
    max: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many login attempts, please try again in an hour'
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use(cors());

const authRoute = require('./routes/auth.route');
const healthRoute = require('./routes/health.route');
const userRoute = require('./routes/user.route');
const instructorRoutes = require("./routes/instructor.route");
const categoryRoutes = require("./routes/category.route");
const courseRoutes = require("./routes/course.route");
const sectionRoutes = require("./routes/section.route");
const lectureRoutes = require("./routes/lecture.route");
const publicCourseRoutes = require("./routes/publicCourse.routes");
const enrollmentRoutes = require("./routes/enrollment.route")
const streamRoutes = require("./routes/stream.route");
const cartRoutes = require("./routes/cart.route");
const paymentRoutes = require("./routes/payment.route");
const reviewRoutes = require("./routes/review.route");
app.get('/', (req, res) => {
    res.send('Welcome to the Finest LMS API!');
});

app.use('/api/health', healthRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/instructors', instructorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/public/courses", publicCourseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/payments",paymentRoutes);
app.use("/api/reviews",reviewRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

module.exports = app;
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const compression = require("compression");
const app = express();

// Enable CORS first so that all responses (including preflights and rate limit errors) have correct headers
app.use(cors());

const swaggerDocs = require("./config/swagger");
const requestIdMiddleware = require("./middlewares/requestId.middleware");
const logger = require("./middlewares/logger.middleware");
const { globalLimiter, authLimiter } = require("./middlewares/rateLimiter.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

swaggerDocs(app);

app.use(helmet());
app.use(requestIdMiddleware);
// app.use(logger);

app.use(
  "/api/payments/webhook",
  express.raw({
    type: "application/json",
  }),
);

app.use(
  express.json({
    limit: "10kb",
  }),
);
app.use(hpp());
app.use(compression());

app.use("/api", globalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

const authRoute = require("./routes/auth.route");
const healthRoute = require("./routes/health.route");
const userRoute = require("./routes/user.route");
const instructorRoutes = require("./routes/instructor.route");
const categoryRoutes = require("./routes/category.route");
const courseRoutes = require("./routes/course.route");
const adminCourseRoutes = require("./routes/adminCourse.route");
const sectionRoutes = require("./routes/section.route");
const lectureRoutes = require("./routes/lecture.route");
const publicCourseRoutes = require("./routes/publicCourse.routes");
const enrollmentRoutes = require("./routes/enrollment.route");
const streamRoutes = require("./routes/stream.route");
const cartRoutes = require("./routes/cart.route");
const paymentRoutes = require("./routes/payment.route");
const reviewRoutes = require("./routes/review.route");
const studentRoutes = require("./routes/student.route");
const certificateRoutes = require("./routes/certificate.route");
const dashboardRoutes = require("./routes/dashboard.route");
const instructorDashboardRoutes = require("./routes/instructorDashboard.route");
const adminDashboardRoutes = require("./routes/adminDashboard.route");
const notificationRoutes = require("./routes/notification.route");

app.get("/", (req, res) => {
  res.send("Welcome to the Fine Course Mart API!");
});

app.use("/api/health", healthRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/instructors", instructorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin/courses", adminCourseRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/public/courses", publicCourseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/instructor/dashboard", instructorDashboardRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(errorMiddleware);

module.exports = app;

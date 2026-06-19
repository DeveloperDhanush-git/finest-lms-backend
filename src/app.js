const express = require('express');
const cors = require('cors')
const app = express();

const swaggerDocs = require('./config/swagger');
swaggerDocs(app);

app.use(cors())
app.use(express.json());

const authRoute = require('./routes/auth.route');
const healthRoute = require('./routes/health.route');
const userRoute = require('./routes/user.route')
const instructorRoutes = require("./routes/instructor.route");
const categoryRoutes = require("./routes/category.route");
const courseRoutes = require("./routes/course.route");
const sectionRoutes =require("./routes/section.route");
const lectureRoutes = require("./routes/lecture.route");
const publicCourseRoutes = require("./routes/publicCourse.routes");

app.get('/', (req, res) => {
    console.log('Received a request to the root endpoint');
    res.send('Welcome to the Finest LMS API!');
});

app.use('/api/health', healthRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute)
app.use('/api/instructors', instructorRoutes)
app.use("/api/categories", categoryRoutes);
app.use("/api/courses",courseRoutes);
app.use("/api/sections",sectionRoutes);
app.use("/api/lectures",lectureRoutes);
app.use("/api/public/courses", publicCourseRoutes);

module.exports = app;
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fine Course Mart API',
      version: '1.0.0',
      description: 'Fine Course Mart Learning Management System API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local Development',
      },
      {
        url: 'http://192.168.1.24:5000/api',
        description: 'Production Server',
      },
    ],
    tags: [
      { name: 'Health', description: 'Health check and availability endpoints' },
      { name: 'Authentication', description: 'User authentication and account access endpoints' },
      { name: 'Users', description: 'User profile and account management endpoints' },
      { name: 'Courses', description: 'Course creation, updates, and catalog management' },
      { name: 'Sections', description: 'Section management within a course' },
      { name: 'Lectures', description: 'Lecture content and media endpoints' },
      { name: 'Categories', description: 'Course category management' },
      { name: 'Enrollments', description: 'Student enrollment management' },
      { name: 'Instructors', description: 'Instructor profile and management endpoints' },
      { name: 'Public Courses', description: 'Publicly accessible course endpoints' },
      { name: 'Stream', description: 'Streaming and video delivery endpoints' },
      { name: 'Cart', description: 'Shopping cart management for students (add, view, remove courses)' },
      { name: 'Payments', description: 'Payment checkout, verification, and history endpoints' },
      { name: 'Reviews', description: 'Course review and rating endpoints' },
      { name: 'Student', description: 'Student learning and progress endpoints' },
      { name: 'Dashboards', description: 'Dashboard summary and analytics endpoints' },
      { name: 'Certificates', description: 'Certificate generation and verification endpoints' },
      { name: 'Admin Courses', description: 'Admin course review and approval endpoints' },
      { name: 'Notifications', description: 'User notification management endpoints' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ['./src/docs/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;

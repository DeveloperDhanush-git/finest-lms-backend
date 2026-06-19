const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FINEST LMS API",
      version: "1.0.0",
      description: "Enterprise Learning Management System API Documentation",
    },
    servers: [
  {
    url: "http://localhost:5000/api",
    description: "Local Development",
  },
  {
    url: "http://192.168.1.24:5000/api",
    description: "Production Server",
  },
],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/docs/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
};

module.exports = swaggerDocs;
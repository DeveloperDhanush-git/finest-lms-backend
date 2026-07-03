const { ZodError } = require("zod");

const validateMiddleware = (schema) => {

  return (req, res, next) => {

    try {

      req.body = schema.parse(req.body);

      next();

    }

    catch (error) {

      if (error instanceof ZodError) {

        return res.status(400).json({

          success: false,

          message: error.issues[0].message,

          errors: error.issues.map(issue => ({

            field: issue.path.join("."),

            message: issue.message,

          })),

        });

      }

      next(error);

    }

  };

};

module.exports = validateMiddleware;
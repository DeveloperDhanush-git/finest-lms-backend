const { ZodError } = require('zod');
const { BadRequestError } = require('../errors');

const validateMiddleware = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      if (source === 'body') {
        req.body = schema.parse(req.body);
      } else if (source === 'query') {
        req.query = schema.parse(req.query);
      } else if (source === 'params') {
        req.params = schema.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        const validationError = new BadRequestError(
          error.issues[0].message,
          'VALIDATION_ERROR'
        );
        validationError.errors = errors;
        return next(validationError);
      }
      next(error);
    }
  };
};

module.exports = validateMiddleware;

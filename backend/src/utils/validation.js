import Joi from 'joi';

// Auth validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Valid email required',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required'
  }),
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Username must contain only letters and numbers',
    'string.min': 'Username must be at least 3 characters',
    'any.required': 'Username is required'
  }),
  displayName: Joi.string().max(100).optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).max(128).required()
});

export const updateProfileSchema = Joi.object({
  displayName: Joi.string().max(100).optional(),
  username: Joi.string().alphanum().min(3).max(30).optional()
});

// Progress validation schemas
export const completeLessonSchema = Joi.object({
  lessonId: Joi.number().integer().positive().required(),
  moduleId: Joi.number().integer().positive().required(),
  timeSpentSeconds: Joi.number().integer().min(0).optional()
});

export const completeLabSchema = Joi.object({
  lessonId: Joi.number().integer().positive().required(),
  moduleId: Joi.number().integer().positive().required(),
  commandsExecuted: Joi.array().items(Joi.string()).optional()
});

export const submitQuizSchema = Joi.object({
  lessonId: Joi.number().integer().positive().required(),
  moduleId: Joi.number().integer().positive().required(),
  answers: Joi.array().items(Joi.number().integer().min(0)).required()
});

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }));
      return res.status(422).json({
        success: false,
        error: 'Validation failed',
        details
      });
    }

    req.body = value;
    next();
  };
};

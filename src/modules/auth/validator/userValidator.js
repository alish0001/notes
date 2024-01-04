const Joi = require("joi");

const validateCreateUser = (payload) => {
  const schema = Joi.object({
    userEmail: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),
    password: Joi.string()
      .min(8)
      .max(15)
      .pattern(/^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password cannot exceed 15 characters",
        "string.pattern.base":
          "Password must contain at least one uppercase letter and one symbol",
        "any.required": "Password is required",
      }),
  });

  const { error } = schema.validate(payload, { abortEarly: false });
  return error ? error.details.map((err) => err.message) : [];
};

const validateLoginUser = (payload) => {
  const schema = Joi.object({
    userEmail: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(8).max(15).required().messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password cannot exceed 15 characters",
      "any.required": "Password is required",
    }),
  });
  const { error } = schema.validate(payload, { abortEarly: false });
  return error ? error.details.map((err) => err.message) : [];
};
module.exports = {
  validateCreateUser,
  validateLoginUser,
};

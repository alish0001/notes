const config = require("../../../config/serverConfig");
const Joi = require("joi");
const ObjectId = require("mongodb").ObjectId;

const validateCreateNote = (body) => {
  const schema = Joi.object({
    userEmail: Joi.string().email().required().messages({
      "string.email": "Please provide a valid user email",
      "any.required": "User email is required",
    }),
    content: Joi.string()
      .required()
      .max(parseInt(config.maximumAllowedNoteSize, 10))
      .messages({
        "string.base": "Content must be a string",
        "any.required": "Content for the notes is required",
        "string.max": `Content is too big. Maximum allowed characters: ${config.maximumAllowedNoteSize}`,
      }),
  });

  const { error } = schema.validate(body, { abortEarly: false });
  return error ? error.details.map((err) => err.message) : [];
};

const validateUpdateNote = (body, id) => {
  const schema = Joi.object({
    content: Joi.string()
      .required()
      .max(parseInt(config.maximumAllowedNoteSize, 10))
      .messages({
        "any.required": "Content for the note is required",
        "string.empty": "Content must not be empty",
        "string.max": `Content is too big. Maximum allowed characters: ${config.maximumAllowedNoteSize}`,
      }),
    id: Joi.string().custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.message("Invalid MongoDB ObjectId");
      }
      return value;
    }, "MongoDB ObjectId"),
  });

  const { error } = schema.validate({ ...body, id }, { abortEarly: false });
  return error ? error.details.map((err) => err.message) : [];
};

const isValidEmail = (email) => {
  const schema = Joi.string().email();
  const { error } = schema.validate(email);
  return error === undefined;
};

module.exports = {
  validateCreateNote,
  validateUpdateNote,
  isValidEmail,
};

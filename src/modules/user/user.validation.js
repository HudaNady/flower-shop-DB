import joi from "joi";

export const updatePassword = joi.object({
  currentPassword: joi.string().required(),
  newPassword: joi
    .string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .message(
      "password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters "
    )
    .required(),
  confirmPassword: joi
    .string()
    .valid(joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password does not match",
      "string.empty": "Confirm password is required",
    }),
});
export const updateUserSchema = joi.object({
  lastName: joi
    .string()
    .lowercase()
    .min(3)
    .max(15)
    .trim()
    .messages({ message: "First name must be a string" }),
  firstName: joi
    .string()
    .lowercase()
    .min(3)
    .max(15)
    .trim()
    .message({ message: "Last name must be a string" }),
  email: joi
    .string()
    .email()
    .messages({ message: "Email must be a valid email address" }),
  mobileNumber: joi
    .string()
    .pattern(/^01[0-2,5]{1}[0-9]{8}$/)
    .messages({ message: "Mobile number must be valid mobile number" }),
  city: joi.string().min(3).max(30).trim().messages({
    "string.base": "city must be a string",
    "string.empty": "city is required",
    "string.min": "city must be at least 3 characters",
    "string.max": "city must be at most 30 characters",
  }),
  street: joi.string().min(3).max(30).trim().messages({
    "string.base": "street must be a string",
    "string.empty": "street is required",
    "string.min": "street must be at least 3 characters",
    "string.max": "street must be at most 30 characters",
  }),
  file: joi.object({
    size: joi.number().positive().required(),
    originalname: joi.string(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    fieldname: joi.string().required(),
    filename: joi.string(),
    path: joi.string().uri(),
  }),
});

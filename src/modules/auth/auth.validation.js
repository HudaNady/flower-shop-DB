import Joi from "joi";
import roles from "../../types/roles.js";

export const signUpSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(20)
    .trim()
    .required()
    .messages({
      "string.base": "First name must be a string",
      "string.empty": "First name is required",
      "string.min": "First name must be at least 3 characters",
      "string.max": "First name must be at most 20 characters",
    }),
  lastName: Joi.string()
    .min(3)
    .max(20)
    .trim()
    .required()
    .messages({
      "string.base": "Last name must be a string",
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least 3 characters",
      "string.max": "Last name must be at most 20 characters",
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "string.empty": "Email is required",
    }),
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .required()
    .messages({
      "string.pattern.base": "Password must contain at least one number, one uppercase and lowercase letter, and at least 8 characters",
      "string.empty": "Password is required",
    }),
  confirmPass: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Confirm password does not match",
      "string.empty": "Confirm password is required",
    }),
  rol: Joi.string()
    .valid(roles.user, roles.admin)
    .messages({
      "any.only": "Role must be either user or admin",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "string.empty": "Email is required",
    }),
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .required()
    .messages({
      "string.pattern.base": "Password must contain at least one number, one uppercase and lowercase letter, and at least 8 characters",
      "string.empty": "Password is required",
    }),
});

export const forgotpassSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "string.empty": "Email is required",
    }),
});

export const confirmEmailSchema = Joi.object({
  code: Joi.string()
    .length(4)
    .required()
    .messages({
      "string.length": "Code must be exactly 4 digits",
      "string.empty": "Code is required",
    }),
});

export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .required()
    .messages({
      "string.pattern.base": "Password must contain at least one number, one uppercase and lowercase letter, and at least 8 characters",
      "string.empty": "New password is required",
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password does not match",
      "string.empty": "Confirm password is required",
    }),
});
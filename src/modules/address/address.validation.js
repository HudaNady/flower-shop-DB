import joi from "joi";

export const addressSchema = joi.object({
  city: joi.string()
      .min(3)
      .max(30)
      .trim()
      .required()
      .messages({
        "string.base": "city must be a string",
        "string.empty": "city is required",
        "string.min": "city must be at least 3 characters",
        "string.max": "city must be at most 30 characters",
      }),
      street: joi.string()
      .min(3)
      .max(30)
      .trim()
      .required()
      .messages({
        "string.base": "street must be a string",
        "string.empty": "street is required",
        "string.min": "street must be at least 3 characters",
        "string.max": "street must be at most 30 characters",
      }),
});


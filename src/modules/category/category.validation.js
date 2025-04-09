import  joi from "joi" 

export const addCategorySchema=joi.object({
    name: joi.string().min(3).max(25).trim().required(),
    file: joi.object({
        size:joi.number().positive().required(),
        path:joi.string().required(),
        filename:joi.string().required(),
        originalname:joi.string(),
        destination:joi.string().required(),
        mimetype:joi.string().required(),
        encoding:joi.string().required(),
        fieldname:joi.string().required()
    })
})
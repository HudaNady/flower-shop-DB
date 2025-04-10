import  joi from "joi" 

export const addCategorySchema=joi.object({
    name: joi.string().min(3).max(25).trim().required(),
    file: joi.object({
        size:joi.number().positive().required(),
        originalname:joi.string(),
        mimetype:joi.string().required(),
        encoding:joi.string().required(),
        fieldname:joi.string().required(),
        filename:joi.string(),
        path: joi.string().uri()
    })
})
import  joi from "joi" 

export const addProductSchema=joi.object({
    title: joi.string().min(3).max(25).trim().required(),
    description:joi.string().min(3).max(1500).trim().required(),
    price:joi.number().min(0).required(),
    priceAfterDiscount:joi.number().min(0),
    stock:joi.number().min(0).required(),
    sold:joi.number().min(0),
    rateCount:joi.number().min(0),
    rateAvrage:joi.number().min(0),
    category: joi.string().hex().min(24).max(24).trim().required(),
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
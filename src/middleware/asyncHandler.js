import AppError from "../utils/Error.js"

const asyncHandler =(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch((error)=>{
            return next(new AppError(error.message,500))
        })
    }
}
export default asyncHandler
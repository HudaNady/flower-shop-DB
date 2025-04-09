import jwt from "jsonwebtoken";
import AppError from "../utils/Error.js";
import asyncHandler from "./asyncHandler.js";
import User from "../../DB/models/User.js";

export const authentication=asyncHandler(
    async(req,res,next)=>{
        const auth=req.headers.authorization
        if(!auth){
            return next(new AppError("token must send in headers",401))
        }   
        const token=await auth.split(' ')[1]
        const payload= jwt.verify(token,process.env.KEY)
        if(!payload){
            res.status(400).json({message:'invalid payload'})
        }
        const exist =await User.findById(payload._id)
        if(!exist){
            res.status(400).json({message:'authorized'})
        }
        if(!exist.passwordChanged){
            req.user=payload
            return next()
        }
        const time =parseInt(exist.passwordChanged.getTime()/1000)
        if(time>payload.iat){
            res.status(401).json({message:'token expired'})
        }
        req.user=payload
        return next()
}
)
export const authorization =(roles)=>{
    return asyncHandler(async(req,res,next)=>{
        if(!Object.values(roles).includes(req.user.rol)){
        return next(new AppError("forbidden",403))
    }
    return next()
    })
} 

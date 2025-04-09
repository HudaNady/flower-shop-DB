import bcrybtjs from "bcryptjs";
import { customAlphabet } from "nanoid";
import User from "../../../../DB/models/User.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";
import jwt from "jsonwebtoken";
import sendEmail from "../../../utils/sendEmail.js";

//sign
export const signUp = asyncHandler(async (req, res, next) => {
    const { password, email } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
        return next(new AppError("email already exist", 409));
    }
    req.body.password = bcrybtjs.hashSync(password, 8);
    const user = await User.insertMany([req.body]);
    return res.status(201).json({ message: "done", user });
});
//login
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const userExist = await User.findOne({email});
    if (!userExist) {
        return next(new AppError("invalid email or password", 400));
    } else {
        const match = bcrybtjs.compareSync(password, userExist.password);
        if (!match) {
            return next(new AppError("invalid email or password", 400));
        }
        const token = jwt.sign(
            {
                name:userExist.name,
                _id: userExist._id,
                email:userExist.email,
                rol: userExist.rol,
            },
            process.env.KEY
        );
        return res.status(200).json({ message: "done", token });
    }
});

//Forgot password and send email
export const forgotpass = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
        return next(new AppError("email not found", 404));
    }
    const generateCode=customAlphabet("0123456789", 4);
    const code = generateCode()
    userExist.code=code
    userExist.codeExpires = Date.now() + 3600000; // 1 hour
    await userExist.save();
    sendEmail({ to: email, html: `<p> Your verification code is:<span style="color:blue">${code}</span></spane></p>` });
    return res
        .status(201)
        .json({ message: "check you email and reset password" });
});
//confirm email
export const verifyResetCode=asyncHandler(async (req, res, next) => {
    const { code } = req.body;
    const user = await User.findOne({
        code: code,
        codeExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError("Invalid or expired verification code", 400));
    }

    user.isVerifiedForReset = true;
    await user.save();

    res.status(200).send({message:'Code verified, you can now reset your password'});

})
// reset password
export const resetPassword = async (req, res) => {
    const { newPassword} = req.body;
    const user = await User.findOne({
        isVerifiedForReset: true
    });

    if (!user) {
        return next(new AppError("User not verified for password reset", 400));
    }
    const hashPassword = bcrybtjs.hashSync(newPassword, 8);
    user.password = hashPassword;
    user.code= undefined;
    user.codeExpires = undefined;
    user.isVerifiedForReset = false;
    await user.save();

    res.status(200).json({message:'Password has been reset'});

};








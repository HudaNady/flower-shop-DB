import User from "../../../../DB/models/User.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";
import bcryptjs from 'bcryptjs';

export const updatePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const match = bcryptjs.compareSync(currentPassword, user.password);
    if (!match) {
        return next(new AppError("Old password is not correct", 400));
    }

    user.password = bcryptjs.hashSync(newPassword, 8);
    user.passwordChanged = new Date();
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
});

export const updateUserData = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    req.body.image = req.file?.filename;

    // Check for email conflict, excluding the current user's email
    const conflictEmail = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (conflictEmail) {
        return next(new AppError("Email already in use", 400));
    }

    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
    });

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    return res.status(200).json({ message: "User updated successfully", user });
});

export const getUserData = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    return res.status(200).json({ message: "User data retrieved successfully", user });
});

export const getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().select('email lastName firstName _id');

    if (!users.length) {
        return next(new AppError("No users found", 404));
    }

    return res.status(200).json({ message: "Users retrieved successfully", users });
});
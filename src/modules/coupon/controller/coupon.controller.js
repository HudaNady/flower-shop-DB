import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";
import Coupon from "../../../../DB/models/Coupon.js";

export const addCoupon = asyncHandler(async (req, res, next) => {
    const couponExist = await Coupon.findOne({ code: req.body.code});
    if (couponExist) {
        return next(new AppError("Coupon already exists", 409));
    }
    req.body.createBy=req.user._id 
    const coupon = await Coupon.create(req.body);
    return res.status(201).json({ message: "Coupon added successfully", coupon });
});

export const getAllCoupons = asyncHandler(async (req, res, next) => {
    const coupons = await Coupon.find();
    if (coupons.length) {
        return res.status(200).json({ message: "Coupons retrieved successfully", coupons });
    }
    return next(new AppError("No coupons found", 404));
});

export const updateCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params._id);
    if (!coupon) {
        return next(new AppError("Coupon not found", 404));
    }
    const updatedCoupon = await Coupon.findByIdAndUpdate(req.params._id, req.body, { new: true });
    return res.status(200).json({ message: "Coupon updated successfully", coupon: updatedCoupon });
});

export const deleteCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findByIdAndDelete(req.params._id);
    if (!coupon) {
        return next(new AppError("Coupon not found", 404));
    }
    return res.status(200).json({ message: "Coupon deleted successfully" });
});
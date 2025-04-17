import asyncHandler from "../../../middleware/asyncHandler.js";
import Review from "../../../../DB/models/Review.js";
import AppError from "../../../utils/Error.js";
import roles from "../../../types/roles.js";
import Product from "../../../../DB/models/Product.js";

export const addReview = asyncHandler(async (req, res, next) => {
    req.body.user = req.user._id;
    const reviewExist = await Review.findOne({ user: req.user._id, product: req.body.product });
    if (reviewExist) {
        return next(new AppError("You have already reviewed this product", 409));
    }
    const product = await Product.findById(req.body.product);
    if (!product) {
        return next(new AppError("Product not found", 404));
    }
    const review = await Review.create(req.body);
    product.reviews.push(review._id);
    await product.save();
    return res.status(201).json({ message: "Review added successfully", review });
});

export const getAllReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find().populate('user');
    if (reviews.length) {
        return res.status(200).json({ message: "Reviews retrieved successfully", reviews });
    }
    return next(new AppError("Reviews not found", 404));
});



export const updateReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params._id);
    if (!review) {
        return next(new AppError("Review not found", 404));
    }
    if (review.user.toString() === req.user._id || req.user.rol === roles.admin) {
        const updatedReview = await Review.findByIdAndUpdate(req.params._id, req.body, { new: true });
        return res.status(200).json({ message: "Review updated successfully", review: updatedReview });
    }
    return next(new AppError("Forbidden", 403));
});

export const deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params._id);
    if (!review) {
        return next(new AppError("Review not found", 404));
    }
    if (review.user.toString() === req.user._id || req.user.rol === roles.admin) {
        await Review.findByIdAndDelete(req.params._id);
        return res.status(200).json({ message: "Review deleted successfully" });
    }
    return next(new AppError("Forbidden", 403));
});

export const getReviewsForProduct = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find({ product: req.params._id }).populate('user','firstName lastName email userName' )

    if (reviews.length > 0) {
        return res.status(200).json({ message: "Reviews retrieved successfully", reviews });
    }
    return next(new AppError("No reviews found for this product", 404));
});
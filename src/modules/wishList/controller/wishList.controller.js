import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";
import User from "../../../../DB/models/User.js";

export const addWishList=asyncHandler(
    async (req, res, next) => {
        const user = await User.findByIdAndUpdate(req.user._id,
            {
                $push: { wishList: req.body.productId  } 
            },
            {
                new:true
            }
        );
        if (!user) {
            return next(new AppError("User not found", 404));
        }
        return res.status(201).json({ message: "Product added to wishlist", wishList: user.wishList });
    }
)
export  const getWishList=asyncHandler(
    async (req, res, next) => {
        const user = await User.findById(req.user._id).populate({
            path: 'wishList', 
            model: 'Product' 
        });;

        if (!user || !user.wishList || user.wishList.length === 0) {
            return next(new AppError("No wishlist items found", 404));
        }
    
        return res.status(200).json({ message: "Wishlist retrieved successfully", wishList: user.wishList });
    }
)
export  const deleteFromWishList=asyncHandler(
    async (req, res, next) => {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: { wishList: req.params.id }
            },
            {
                new: true
            }
        );
    
        if (!user) {
            return next(new AppError("User not found", 404));
        }
    
        return res.status(200).json({ message: "Product removed from wishlist", wishList: user.wishList });
    }
    
)

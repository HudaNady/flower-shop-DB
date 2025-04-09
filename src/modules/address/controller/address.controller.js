import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";
import User from "../../../../DB/models/User.js";

export const addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: { address: req.body },
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  return res.status(200).json({ message: "done", user });
});

export const getAllAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user || !user.address || user.address.length === 0) {
        return next(new AppError("No addresses found", 404));
    }

    return res.status(200).json({ message: "Addresses retrieved successfully", address: user.address });
});

export const deleteAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { address: { _id: req.params._id } }
        },
        {
            new: true
        }
    );

    if (!user) {
        return next(new AppError("Address not found", 404));
    }

    return res.status(200).json({ message: "Address deleted successfully", address: user.address });
});

import slugify from "slugify";
import asyncHandler from "../../../middleware/asyncHandler.js";
import Category from "../../../../DB/models/Category.js";
import AppError from "../../../utils/Error.js";
import deleteImageFile from "../../../utils/deleteImageFile.js";
import Product from "../../../../DB/models/Product.js";

export const addCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    req.body.image = req.file?.filename;
    req.body.createdBy = req.user._id;
    req.body.slug = slugify(name);

    const category = await Category.create(req.body);
    return res.status(201).json({ message: "Category added successfully", category });
});

export const getAllCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find()

    if (categories.length) {
        return res.status(200).json({ message: "Categories retrieved successfully", categories });
    }
    return next(new AppError("Categories not found", 404));
});

export const getCategoryById = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params._id);
    if (category) {
        return res.status(200).json({ message: "Category retrieved successfully", category });
    }
    return next(new AppError("Category not found", 404));
});

export const updateCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    req.body.slug = slugify(name);
    req.body.updatedBy = req.user._id;

    const oldCategory = await Category.findById(req.params._id);
    if (!oldCategory) {
        return next(new AppError("Category not found", 404));
    }

    const oldImagePath = oldCategory.image;
    req.body.image = req.file?.filename;

    const category = await Category.findByIdAndUpdate(req.params._id, req.body, { new: true });

    // Delete old image in upload folder
    if (oldImagePath && oldImagePath !== req.body.image) {
        await deleteImageFile(oldImagePath, 'category');
    }

    return res.status(200).json({ message: "Category updated successfully", category });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params._id);
    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    // Delete category image
    // if (category.image) {
    //     const fulpath=category.image.split("/")
    //     const filename=fulpath[fulpath.length-1]
    //     await deleteImageFile(filename,'category');
    // }

    const praductsOfCategoryDel=await Product.find({category:req.params._id})
    await Category.findByIdAndDelete(req.params._id);
    if(praductsOfCategoryDel){
        await Product.deleteMany({category:req.params._id})
    }
    return res.status(200).json({ message: "Category deleted successfully", category });
});


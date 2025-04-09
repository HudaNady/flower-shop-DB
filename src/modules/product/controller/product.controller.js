import slugify from "slugify";
import asyncHandler from "../../../middleware/asyncHandler.js";
import Product from "../../../../DB/models/Product.js";
import AppError from "../../../utils/Error.js";
import fs from 'fs';
import path from "path";
import ApiFeatures from "../../../utils/apiFeatures.js";
import deleteImageFile from "../../../utils/deleteImageFile.js";
import Category from "../../../../DB/models/Category.js";

export const addProduct = asyncHandler(async (req, res, next) => {
    const category=await Category.findById(req.body.category)
    if(!category){
        return res.status(404).json({ message: "Category not found"});
    }
    req.body.slug = slugify(req.body.title);
    req.body.createdBy = req.user._id;
    req.body.mainImage = req?.files?.mainImage[0].filename;
    req.body.coverImage = req?.files?.coverImage?.map(ele => ele.filename);
    const product = await Product.create(req.body);
    return res.status(201).json({ message: "Product added successfully", product });
});

export const getAllProducts = asyncHandler(async (req, res, next) => {
    const mongooseQuery = Product.find();
    const apiFeatures = new ApiFeatures(mongooseQuery, req.query)
            .pagination() 
            .sort()       
            .fields()     
            .search();    

    const products = await apiFeatures.mongooseQuery.populate([
        {
            path: 'category'
        }
    ]);

    if (products.length) {
        return res.status(200).json({ message: "Products retrieved successfully", products });
    }
    return res.status(404).json({ message: "Products not found", products: [] });
});

export const getProductById = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params._id).populate([
        {
            path: 'category'
        },
    ]);
    if (product) {
        return res.status(200).json({ message: "Product retrieved successfully", product });
    }
    return next(new AppError("Product not found", 404));
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params._id);
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    // Delete main image
    if (product.mainImage) {
        const fulpath=product.mainImage.split("/")
        const filename=fulpath[fulpath.length-1]
        console.log(filename);
        
        await deleteImageFile(filename, 'product');
        await Product.findByIdAndDelete(req.params._id);
        return res.status(200).json({ message: "Product deleted successfully", product });
    }

    // Delete cover images
    if (product.coverImage && product.coverImage.length > 0) {
        await Promise.all(product.coverImage.map(image => deleteImageFile(image, 'product')));
    }

    // await Product.findByIdAndDelete(req.params._id);
    // return res.status(200).json({ message: "Product deleted successfully", product });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
    req.body.slug = slugify(req.body.title);
    req.body.updatedBy = req.user._id;
    const oldProduct = await Product.findById(req.params._id);
    if (!oldProduct) {
        return next(new AppError("Product not found", 404));
    }

    if (req.files?.mainImage) {
        req.body.mainImage = req.files?.mainImage[0]?.filename;
        if (oldProduct.mainImage && oldProduct.mainImage !== req.body.mainImage) {
            await deleteImageFile(oldProduct.mainImage, 'product');
        }
    }

    req.body.coverImage = req.files?.coverImage?.map(ele => ele.filename);
    if (oldProduct.coverImage.length > 0) {
        const oldCoverImagePaths = oldProduct.coverImage.filter(
            (img) => !req.body.coverImage.includes(img)
        );
        await Promise.all(oldCoverImagePaths.map(image => deleteImageFile(image, 'product')));
    }

    const product = await Product.findByIdAndUpdate(req.params._id, req.body, { new: true });
    return res.status(200).json({ message: "Product updated successfully", product });
});


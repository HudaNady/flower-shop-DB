import slugify from "slugify";
import asyncHandler from "../../../middleware/asyncHandler.js";
import Product from "../../../../DB/models/Product.js";
import AppError from "../../../utils/Error.js";
import fs from "fs";
import path from "path";
import ApiFeatures from "../../../utils/apiFeatures.js";
import deleteImageFile from "../../../utils/deleteImageFile.js";
import Category from "../../../../DB/models/Category.js";

export const addProduct = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  req.body.slug = slugify(req.body.title);
  req.body.createdBy = req.user._id;
  req.body.image = req.file?.filename;
  // req.body.coverImage = req?.files?.coverImage?.map(ele => ele.filename);
  const product = await Product.create(req.body);
  return res
    .status(201)
    .json({ message: "Product added successfully", product });
});

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const findproducts = await Product.find();
  for (const product of findproducts) {
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      product.reviews.length > 0
        ? (totalRating / product.reviews.length).toFixed(1)
        : product.rateAvrage;
    product.rateAvrage = averageRating;
    await product.save();
  }
  const mongooseQuery = Product.find();

  const apiFeatures = new ApiFeatures(mongooseQuery, req.query)
    .pagination()
    .sort()
    .fields()
    .search();

  const products = await apiFeatures.mongooseQuery.populate([
    {
      path: "category",
    },
  ]);
  const total = findproducts.length;
  if (products.length) {
    return res
      .status(200)
      .json({ message: "Products retrieved successfully", total, products });
  }
  return res.status(404).json({ message: "Products not found", products: [] });
});

export const getAllProductsInCatecory = asyncHandler(async (req, res, next) => {
  const findproducts = await Product.find();
  for (const product of findproducts) {
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      product.reviews.length > 0
        ? (totalRating / product.reviews.length).toFixed(1)
        : product.rateAvrage;
    product.rateAvrage = averageRating;
    await product.save();
  }
  let apiFeatures = new ApiFeatures(
    Product.find({ category: req.params._id }),
    req.query
  );
  apiFeatures = apiFeatures.pagination().sort().fields().search();
  const products = await apiFeatures.mongooseQuery.populate("category");

  if (products.length) {
    return res.status(200).json({ message: "done", products, status: 200 });
  }
  return next(new AppError("products not found", 404));
});

export const getProductById = asyncHandler(async (req, res, next) => {
  const productfind = await Product.findById(req.params._id);
  const totalRating = productfind.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const averageRating =
    productfind.reviews.length !== 0
      ? (totalRating / productfind.reviews.length).toFixed(1)
      : productfind.rateAvrage;
  product.rateAvrage = averageRating;
  await product.save();

  const product = await Product.findById(req.params._id).populate([
    {
      path: "category",
    },
    {
      path: "reviews",
      populate: {
        path: "user",
        select: "userName email",
      },
    },
  ]);
  if (product) {
    return res
      .status(200)
      .json({ message: "Product retrieved successfully", product });
  }
  return next(new AppError("Product not found", 404));
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params._id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Delete main image
  if (product.image) {
    const fulpath = product.image.split("/");
    const filename = fulpath[fulpath.length - 1];
    console.log(filename);

    // await deleteImageFile(filename, 'product');
    await Product.findByIdAndDelete(req.params._id);
    return res
      .status(200)
      .json({ message: "Product deleted successfully", product });
  }

  // Delete cover images
  // if (product.coverImage && product.coverImage.length > 0) {
  //     await Promise.all(product.coverImage.map(image => deleteImageFile(image, 'product')));
  // }

  await Product.findByIdAndDelete(req.params._id);
  return res
    .status(200)
    .json({ message: "Product deleted successfully", product });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  req.body.updatedBy = req.user._id;
  const oldProduct = await Product.findById(req.params._id);
  if (!oldProduct) {
    return next(new AppError("Product not found", 404));
  }
  const oldImagePath = oldProduct.image;
  req.body.image = req.file?.filename;
  if (oldImagePath && oldImagePath !== req.body.image) {
    await deleteImageFile(oldImagePath, "product");
  }

  // req.body.coverImage = req.files?.coverImage?.map(ele => ele.filename);
  // if (oldProduct.coverImage.length > 0) {
  //     const oldCoverImagePaths = oldProduct.coverImage.filter(
  //         (img) => !req.body.coverImage.includes(img)
  //     );
  //     await Promise.all(oldCoverImagePaths.map(image => deleteImageFile(image, 'product')));
  // }

  const product = await Product.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
  });
  return res
    .status(200)
    .json({ message: "Product updated successfully", product });
});

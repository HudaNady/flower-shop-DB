// import Cart from "../../../../DB/models/Cart.js";
// import Coupon from "../../../../DB/models/Coupon.js";
// import Product from "../../../../DB/models/Product.js";
// import asyncHandler from "../../../middleware/asyncHandler.js";
// import AppError from "../../../utils/Error.js";

// async function calc(cart){
//     const subTotal=cart.products.reduce((prev,element)=>prev+element.quantity*element.price,0)
//     if(!cart.discount){
//         cart.total=subTotal
//     }
//     cart.total=subTotal-(subTotal*cart.discount)/100
//     cart.subTotal=subTotal
//     await cart.save()
// }
// export const addCart=asyncHandler(
//     async (req, res, next) => {
//         const cartExist= await Cart.findOne({user:req.user._id})
//         if(!cartExist){
//             const newCart = await Cart.create({user:req.user._id});
//             const product= await Product.findById(req.body.product)
//             if(!product){
//                 return next(new AppError("product not found ", 404));
//             }
//             req.body.price=product.priceAfterDiscount
//             if(product.stock<req.body.quantity){
//                 return next(new AppError("out of stock ", 400));
//             }
//             const addToCart = await Cart.findOneAndUpdate(
//                 {user:req.user._id},
//                 {
//                     $push:{products:req.body}
//                 },
//                 {
//                     new:true
//                 }
//             );
//             await addToCart.save()
//             calc(addToCart)
//             return res.status(201).json({ message: "done", addToCart,status:201 });
//         }
//         let productExist=false
//         const product= await Product.findById(req.body.product)

//             if(!product){
//                 return next(new AppError("product not found ", 404));
//             }
//             req.body.price=product.priceAfterDiscount
//             if(product.stock<req.body.quantity){
//                 return next(new AppError("out of stock ", 400));
//             }
//             cartExist.products.forEach(async(pro)=>{
//                 if(pro.product==req.body.product){
//                     productExist=true
//                     if(product.stock<req.body.quantity+pro.quantity){
//                         return next(new AppError("out of stock ", 400));
//                     }
//                     pro.quantity=req.body.quantity+pro.quantity
//                     await cartExist.save()
//                     calc(cartExist)
//                     return res.status(200).json({ message: "done", cartExist,status:200 });
//                 }
//             })
//         if(!productExist){
//             const addToCart = await Cart.findOneAndUpdate(
//                 {user:req.user._id},
//                 {
//                     $push:{products:req.body}
//                 },
//                 {
//                     new:true
//                 }
//             );

//             await addToCart.save()
//             calc(addToCart)
//             return res.status(201).json({ message: "done", addToCart,status:201 });
//         }
//     }
// )
// export  const applyCoupon=asyncHandler(
//         async (req, res, next) => {
//             const coupon= await Coupon.findOne({code:req.body.code,expired:{$gte:Date.now()}})
//             if(!coupon){
//                 return next(new AppError("coupon not found", 404));
//             }
//             const cartExist= await Cart.findOne({user:req.user._id})
//             cartExist.discount=coupon.discount
//             await cartExist.save()
//             calc(cartExist)
//             return res.status(201).json({ message: "done", cartExist,status:201 });
//         }
// )
// export  const getCart=asyncHandler(
//     async (req, res, next) => {
//         const cart= await Cart.findOne({user:req.user._id})
//         if(cart){
//             return res.status(200).json({ message: "done", cart,status:200 });
//         }
//         return next(new AppError("cart not found", 404));
//     }
// )
// export  const deleteProduct=asyncHandler(
//     async (req, res, next) => {
//         const cart = await Cart.findOneAndDelete(
//             {user:req.user._id},
//             {
//                 $pull:{products:{_id:req.params._id}}
//             },
//             {
//                 new:true
//             }
//         );
//         if(!cart){
//             next(new AppError("cart not found", 404))
//         }
//         await cart.save()
//         calc(cart)
//         return res.status(200).json({ message: "done", cart ,status:200 })
//     }
// )
// export  const updateProductQuantity=asyncHandler(
//     async (req, res, next) => {
//         const cart= await Cart.findOne({user:req.user._id})
//         if(!cart){
//             return next(new AppError("cart not found", 404));
//         }
//         let productExist=false
//         cart.products.forEach(async(pro)=>{
//             if(pro.product==req.params._id){
//                 productExist=true
//                 pro.quantity=req.body.quantity
//                 await cart.save()
//                 calc(cart)
//                 return res.status(200).json({ message: "done", cart,status:200 });
//             }
//         })
//         if(!productExist){
//             return next(new AppError("product not found in cart", 404));

//         }
//     }
// )
// export  const deleteCart=asyncHandler(
//     async (req, res, next) => {
//         const cart= await Cart.findById(req.params._id)
//         if(!cart){
//             return next(new AppError("Review not found", 404));
//         }
//         Cart.deleteOne(req.params._id)
//         return res.status(200).json({ message: "done", cart,status:200 })
//     }
// )

import Cart from "../../../../DB/models/Cart.js";
import Coupon from "../../../../DB/models/Coupon.js";
import Product from "../../../../DB/models/Product.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";

async function calc(cart) {
  const subTotal = cart.products.reduce(
    (prev, element) => prev + element.quantity * element.price,
    0
  );
  cart.subTotal = subTotal;
  cart.total = cart.discount
    ? subTotal - (subTotal * cart.discount) / 100
    : subTotal;
  await cart.save();
}

export const addCart = asyncHandler(async (req, res, next) => {
  const cart =
    (await Cart.findOne({ user: req.user._id })) ||
    (await Cart.create({ user: req.user._id }));
  const product = await Product.findById(req.body.product);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  if (product.stock < req.body.quantity) {
    return next(new AppError("Out of stock", 400));
  }

  req.body.price = product.priceAfterDiscount;
  const existingProduct = cart.products.find(
    (pro) => pro.product.toString() === req.body.product
  );

  if (existingProduct) {
    if (product.stock < req.body.quantity + existingProduct.quantity) {
      return next(new AppError("Out of stock", 400));
    }
    existingProduct.quantity += req.body.quantity;
  } else {
    cart.products.push(req.body);
  }

  await cart.save();
  await calc(cart);
  return res.status(201).json({ message: "Product added to cart", cart });
});

export const applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    code: req.body.code,
    expired: { $gte: Date.now() },
  });
  if (!coupon) {
    return next(new AppError("Coupon not found", 404));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(200).json({
        message: "Cart is empty",
        cart: {
          products: [],
        },
      },200);  }

  cart.discount = coupon.discount;
  await cart.save();
  await calc(cart);
  return res.status(201).json({ message: "Coupon applied", cart });
});

export const getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "products.product"
  );
  if (!cart) {
    return res.status(200).json({
      message: "Cart is empty",
      cart: {
        products: [],
      },
    },200);
  }
  return res.status(200).json({ message: "Cart retrieved", cart });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: { product: req.params._id } } },
    { new: true }
  );

  if (!cart) {
    return res.status(200).json({
        message: "Cart is empty",
        cart: {
          products: [],
        },
      },200);
    
  }

  await calc(cart);
  return res.status(200).json({ message: "Product removed from cart", cart });
});

export const updateProductQuantity = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(200).json({
        message: "Cart is empty",
        cart: {
          products: [],
        },
      },200);  }

  const product = cart.products.find(
    (pro) => pro.product.toString() === req.params._id
  );
  if (!product) {
    return next(new AppError("Product not found in cart", 404));
  }

  product.quantity = req.body.quantity;
  await cart.save();
  await calc(cart);
  return res.status(200).json({ message: "Product quantity updated", cart });
});

export const deleteCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  if (!cart) {
    return res.status(200).json({
        message: "Cart is empty",
        cart: {
          products: [],
        },
      },200);
  }
  return res.status(200).json({ message: "Cart deleted", cart });
});

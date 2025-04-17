import { date } from "joi";
import Cart from "../../../../DB/models/Cart.js";
import Order from "../../../../DB/models/Order.js";
import Product from "../../../../DB/models/Product.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const addOrder = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }
    if (!cart.products.length) {
        return next(new AppError("Cart is empty", 400));
    }

    // Check product availability and update stock
    for (const ele of cart.products) {
        const product = await Product.findById(ele.product);
        if (!product) {
            return next(new AppError(`Product not found: ${ele.product}`, 404));
        }
        if (product.stock < ele.quantity) {
            return next(new AppError(`Out of stock for product ${ele.product}, available: ${product.stock}`, 400));
        }
    }

    // Update product stock and sold count
    for (const ele of cart.products) {
        await Product.findByIdAndUpdate(ele.product, {
            $inc: { sold: ele.quantity, stock: -ele.quantity }
        });
    }

    // Create order
    req.body.products = cart.products;
    req.body.total = Math.round(cart.total);
    req.body.user = req.user._id;
    if (req.body.deliveredAt && new Date(req.body.deliveredAt) < Date.now()) {
        return next(new AppError("Enter a valid future date for delivery", 400));
    }
    req.body.status='pending'
    const order = new Order(req.body);
    const newOrder = await order.save();

    // Handle payment method
    if (req.body.paymentMethod === "card") {
        const domain=req.query.domain
        const YOUR_DOMAIN =domain || 'http://localhost:3000';
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "egp",
                        unit_amount: newOrder.total * 100,
                        product_data: {
                            name: "Total Price"
                        }
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/confirmation/?success=true`,
            cancel_url: `${YOUR_DOMAIN}/ShoppingCart/?canceled=true`,
            client_reference_id: req.user._id,
            customer_email:req.user.email,
            metadata:{
                order_id:newOrder._id.toString(),
                shippingAddress:JSON.stringify(req.body.shippingAddress)
            }
        });
        return res.status(200).json({ session });
    }

    await Cart.findOneAndDelete({ user: req.user._id });
    return res.status(201).json({ message: "Order placed successfully", newOrder });
});



export const getUserOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({user:req.user._id}).populate('products.product','title priceAfterDiscount')

    if (orders.length) {
        return res.status(200).json({ message: "Orders retrieved successfully", orders });
    }
    return next(new AppError("Orders not found", 404));
});

export const getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find().populate('user','name')

    if (orders.length) {
        return res.status(200).json({ message: "Orders retrieved successfully", orders });
    }
    return next(new AppError("Orders not found", 404));
});


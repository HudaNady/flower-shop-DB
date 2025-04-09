import connected from '../DB/conection.js'
import dotenv from 'dotenv'
import globalError from './middleware/globalError.js'
import category from './modules/category/category.routes.js'
import product from './modules/product/product.routes.js'
import review from './modules/review/review.routes.js'
import wishList from './modules/wishList/wishList.routes.js'
import cart from './modules/cart/cart.routes.js'
import order from './modules/order/order.routes.js'
import coupon from './modules/coupon/coupon.routes.js'
import address from './modules/address/address.routes.js'
import authRouter from './modules/auth/auth.routes.js'
import userRouter from './modules/user/user.routes.js'
import Stripe from "stripe";
import asyncHandler from './middleware/asyncHandler.js'
import Order from '../DB/models/Order.js'
import Cart from '../DB/models/Cart.js'


dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function bootstrap(app, express) {
    const baseUrl = '/api/v1'
    process.on('uncaughtException', (err) => {
        console.log(err)
    })
    connected()
    // const endpointSecret = 'whsec_L7efZH6QK6U41OKQwFYAhTkJxCgZCNIW';

    // app.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(
    //     async(req, res) => {
    //         let event = req.body;
    //         if (endpointSecret) {
    //             const signature = req.headers['stripe-signature'].toString();
    //             event = stripe.webhooks.constructEvent(
    //                 req.body,
    //                 signature,
    //                 endpointSecret
    //             );
    //         }
    //         let checkoutSessionCompleted
    //         if (event.type == "checkout.session.completed") {
    //             checkoutSessionCompleted = event.data.object
    //             const userId = session.client_reference_id;
    //             try {
    //                 const order = await Order.findOneAndUpdate({ user: userId }, { isPaid: true }, { new: true });
    //                 if (!order) {
    //                     console.error(`Order not found for user: ${userId}`);
    //                     return res.status(404).send('Order not found');
    //                 }
    //                 await Cart.findOneAndDelete({ user: userId });
    //             } catch (error) {
    //                 console.error('Error updating order or deleting cart:', error);
    //                 return res.status(500).send('Internal Server Error');
    //             }
    //         } else {
    //             console.log(`unhandeled event type ${event.type}`);
    //         }
    //         res.status(200).json({ checkoutSessionCompleted })
    //     }
    // ));

    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

    app.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(
        async (req, res) => {
            let event;
            try {
                const signature = req.headers['stripe-signature'];
                event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
            } catch (err) {
                console.error('Webhook signature verification failed:', err.message);
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }

            if (event.type === "checkout.session.completed") {
                const session = event.data.object;
                const userId = session.client_reference_id;
                const order_id=session.metadata.order_id

                try {
                    console.log(userId,order_id);
                    
                    const order = await Order.findByIdAndUpdate(order_id, { isPaid: true }, { new: true });
                    if (!order) {
                        console.error(`Order not found for user: ${order_id}`);
                        return res.status(404).send('Order not found');
                    }
                    await Cart.findOneAndDelete({ user: userId });
                } catch (error) {
                    console.error('Error updating order or deleting cart:', error);
                    return res.status(500).send('Internal Server Error');
                }
            } else {
                console.log(`Unhandled event type: ${event.type}`);
            }

            res.status(200).json({ received: true });
        }
    ));

    app.use('/uploads', express.static('uploads'))
    app.use(express.json())
    app.use(`${baseUrl}/categories`, category)
    app.use(`${baseUrl}/products`, product)
    app.use(`${baseUrl}/addresses`, address)
    app.use(`${baseUrl}/coupon`, coupon)
    app.use(`${baseUrl}/order`, order)
    app.use(`${baseUrl}/cart`, cart)
    app.use(`${baseUrl}/wishList`, wishList)
    app.use(`${baseUrl}/review`, review)
    app.use(`${baseUrl}/auth`, authRouter)
    app.use(`${baseUrl}/users`, userRouter)
    app.use('*', (req, res) => {
        return res.json({ message: 'not found' })
    })
    process.on('unhandledRejection', (err) => {
        console.log(err)
    })
    app.use(globalError)
}
export default bootstrap
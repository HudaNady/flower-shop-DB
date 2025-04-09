import mongoose, { Types } from "mongoose";

const cartSchema= new mongoose.Schema({
    user:{
        type:Types.ObjectId,
        ref:'User',
        required:[true,'user is required'],
        unique:true
    },
    products:[
        {
            product:{
                type:Types.ObjectId,
                ref:'Product',
                required:[true,'product is required']
            },
            quantity:{
                type:Number,
                default:1
            },
            price:{
                type:Number,
                required:true,
                min:0
            }
        }
    ],
    subTotal:{
        type:Number,
        min:[0,'min price is 0']
    },
    discount:{
        type:Number,
        default:0
    },
    total:{
        type:Number,
        min:0
    }
},{
    timestamps:true
})

const Cart=mongoose.model('Cart',cartSchema)
export default Cart
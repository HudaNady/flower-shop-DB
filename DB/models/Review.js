import mongoose, { Types } from "mongoose";

const reviewSchema= new mongoose.Schema({
    content:{
        type:String,
        required:[true,'content is required'],
        trim:true,
    },
    user:{
        type:Types.ObjectId,
        ref:'User',
        required:[true,'user is required']
    },
    product:{
        type:Types.ObjectId,
        ref:'Product',
        required:[true,'product is required']

    },
    rating:{
        type:Number,
        enum:[1,2,3,4,5]
    }
},{
    timestamps:true
})

const Review=mongoose.model('Review',reviewSchema)
export default Review
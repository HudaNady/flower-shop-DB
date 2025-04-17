import mongoose, { Types } from "mongoose";

const productSchema= new mongoose.Schema({
    title:{
        type:String,
        required:[true,'name is required'],
        trim:true,
        unique:[true,'name is unique'],
        minLength:[3,'min length is 3 characters'],
        maxLength:[25,'max length is 3 characters']
    },
    description:{
        type:String,
        required:[true,'description is required'],
        trim:true,
        minLength:[3,'min length is 3 characters'],
        maxLength:[1500,'max length is 1500 characters']
    },
    slug:{
        type:String,
        required:[true,'slug is required'],
        lowerCase:true
    },
    image:String,
    coverImage:[String],
    price:{
        type:Number,
        required:[true,'price is required'],
        min:[0,'min price is 0']
    },
    priceAfterDiscount:{
        type:Number,
        min:[0,'min price is 0']
    },
    stock:{
        type:Number,
        required:[true,'stock is required'],
        min:[0,'min stock is 0']
    },
    sold:{
        type:Number,
        min:[0,'min sold is 0'],
        default:0
    },
    rateCount:{
        type:Number,
        min:[0,'min rateCount is 0'],
        default:0
    },
    rateAvrage:{
        type:Number,
        min:[0,'min rateAvrage is 0'],
        default:0
    },
    category:{
        type:Types.ObjectId,
        ref:'Category',
        required:[true,'Category is required']
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'User',
        required:[true,'createdBy is required']
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:'User',
    }
},{
    timestamps:true,
    toJSON:{
        virtuals:true
    }

})
// productSchema.post('init',(doc)=>{
//     if(doc.mainImage){
//         doc.mainImage='http://localhost:3000/uploads/product/' + doc.mainImage
//     }
//         let data= doc.coverImage.map((ele)=>{`http://localhost:3000/uploads/product/ ${ele} `
//         doc.coverImage=data
//     })
// })
//online Cloudinary
productSchema.post('init', (doc) => {
    if (doc.image) {
        if (!doc.image.startsWith('http')) {
            const baseUrl = process.env.CLOUDINARY_BASE_URL;
            doc.image = `${baseUrl}/${doc.image}`;
        }
    }
});
productSchema.virtual("reviews",{
    ref:"Review",
    localField:"_id",
    foreignField:"product"
})
productSchema.pre(/^find/,function(){
    this.populate("reviews")
})

productSchema.pre('find', async function (next) {
    const products = await this.model.find(this.getQuery());
    for (const product of products) {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = product.reviews.length!==0 ? (totalRating / product.reviews.length).toFixed(1) : product.rateAvrage;
      product.rateAvrage = averageRating;
      await product.save();
    }
    next();
  });
const Product=mongoose.model('Product',productSchema)
export default Product